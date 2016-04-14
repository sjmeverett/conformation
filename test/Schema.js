
import moment from 'moment';
import Schema from '../src/Schema';
import {expect} from 'chai';


describe('Schema', function () {
  describe('any', function () {
    it('should pass anything', function () {
      let schema = Schema.any();
      expect(schema.validate('').valid).to.be.true;
      expect(schema.validate('fish').valid).to.be.true;
      expect(schema.validate(5).valid).to.be.true;
      expect(schema.validate(true).valid).to.be.true;
      expect(schema.validate(new Date()).valid).to.be.true;
      expect(schema.validate({}).valid).to.be.true;
      expect(schema.validate([]).valid).to.be.true;
    });

    it('should have a required() rule', function () {
      let schema = Schema.any().required();
      expect(schema.validate('').valid).to.be.false;
      expect(schema.validate().valid).to.be.false;
      expect(schema.validate(null).valid).to.be.false;
      expect(schema.validate('fish').valid).to.be.true;
    });
  });


  describe('array', function () {
    it('should pass arrays', function () {
      let schema = Schema.array();
      expect(schema.validate([]).valid).to.be.true;
      expect(schema.validate(5).valid).to.be.false;
    });

    it('should have an items() rule', function () {
      let schema = Schema.array().items(Schema.number());
      expect(schema.validate([]).valid).to.be.true;
      expect(schema.validate([1,2,3]).valid).to.be.true;

      expect(schema.validate([1, 2, 'a'])).to.eql({
        valid: false,
        errors: [
          {message: 'expected a number', path: '2'}
        ]
      });
    });

    it('should have a length(n) rule', function () {
      let schema = Schema.array().length(1);
      expect(schema.validate([]).valid).to.be.false;
      expect(schema.validate([0]).valid).to.be.true;
      expect(schema.validate([0,1]).valid).to.be.false;
    });
  });


  describe('boolean', function () {
    it('should pass booleans', function () {
      let schema = Schema.boolean();
      expect(schema.validate(true).valid).to.be.true;
      expect(schema.validate(false).valid).to.be.true;
      expect(schema.validate(5).valid).to.be.false;
      expect(schema.validate('true').valid).to.be.true;
      expect(schema.validate('true').value).to.be.true;
      expect(schema.validate('false').valid).to.be.true;
      expect(schema.validate('false').value).to.be.false;
    });

    it('should not accept strings on strict mode', function () {
      let schema = Schema.boolean();
      expect(schema.validate('true', {strict: true}).valid).to.be.false;
      expect(schema.validate('false', {strict: true}).valid).to.be.false;
      expect(schema.validate(true, {strict: true}).valid).to.be.true;
    });
  });


  describe('date', function () {
    it('should pass dates', function () {
      let schema = Schema.date();
      expect(schema.validate(new Date()).valid).to.be.true;
      expect(schema.validate(true).valid).to.be.false;
      expect(schema.validate('2016-04-14').valid).to.be.false;
    });

    it('should pass strings when a format is given', function () {
      let schema = Schema.date({format: 'DD/MM/YYYY'});
      let result = schema.validate('14-04-2016');
      expect(result.valid).to.be.true;
      expect(result.value).to.be.an.instanceof(Date);
      expect(result.value - moment('14-04-2016', 'DD/MM/YYYY').toDate()).to.equal(0);

      schema = Schema.date({format: 'DD/MM/YYYY', strict: true});
      expect(schema.validate('14-04-2016').valid).to.be.false;
    });

    it('should not accept strings on strict mode', function () {
      let schema = Schema.date({format: 'DD/MM/YYYY'});
      expect(schema.validate('14-04-2016', {strict: true}).valid).to.be.false;
    });
  });


  describe('moment', function () {
    it('should pass moments', function () {
      let schema = Schema.moment();
      expect(schema.validate(moment()).valid).to.be.true;
      expect(schema.validate(5).valid).to.be.false;
      expect(schema.validate('2016-04-14').valid).to.be.false;
    });

    it('should pass strings when a format is given', function () {
      let schema = Schema.moment({format: 'DD/MM/YYYY'});
      let result = schema.validate('14-04-2016');
      expect(result.valid).to.be.true;
      expect(moment.isMoment(result.value)).to.be.true;
      expect(result.value.format('YYYY-MM-DD')).to.equal('2016-04-14');

      schema = Schema.moment({format: 'DD/MM/YYYY', strict: true});
      expect(schema.validate('14-04-2016').valid).to.be.false;
    });

    it('should not accept strings on strict mode', function () {
      let schema = Schema.moment({format: 'DD/MM/YYYY'});
      expect(schema.validate('14-04-2016', {strict: true}).valid).to.be.false;
    });
  });


  describe('object', function () {
    it('should pass objects', function () {
      let schema = Schema.object();
      expect(schema.validate({}).valid).to.be.true;
      expect(schema.validate(5).valid).to.be.false;
    });

    it('should have a keys() rule', function () {
      let schema = Schema.object().keys({
        a: Schema.number()
      });

      expect(schema.validate({}).valid).to.be.true;
      expect(schema.validate({a: 1}).valid).to.be.true;
      expect(schema.validate({a: 1, b: 2}).valid).to.be.false;

      expect(schema.validate({a: 'fish'})).to.eql({
        valid: false,
        errors: [
          {message: 'expected a number', path: 'a'}
        ]
      });
    });
  });


  describe('string', function () {
    it('should pass strings', function () {
      let schema = Schema.string();
      expect(schema.validate('hello').valid).to.be.true;
      expect(schema.validate(5).valid).to.be.false;
    });

    it('should have a regex rule', function () {
      let schema = Schema.string().regex(/[a-f]/);
      expect(schema.validate('b').valid).to.be.true;
      expect(schema.validate('z').valid).to.be.false;
    });
  });


  describe('create', function () {
    it('should isolate modifications', function () {
      let MySchema = Schema.create();
      MySchema.NumberType.prototype.foo = 5;
      expect(Schema.NumberType.prototype.foo).to.not.exist;
    });
  });
});
