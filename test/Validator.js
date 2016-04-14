
import Validator from '../src/Validator';
import {expect} from 'chai';


describe('Validator', function () {
  it('should run registered rules', function () {
    let rule1Called, rule2Called;

    let rule1 = (value, params) => {
      rule1Called = true;
      expect(value).to.equal('the value');
      expect(params).to.eql({a: 1});
      return {valid: true};
    };

    let rule2 = (value, params) => {
      rule2Called = true;
      expect(value).to.equal('the value');
      expect(params).to.eql({b: 2});
      return {valid: true};
    };

    let validator = new Validator();
    validator.addRule(rule1, {a: 1});
    validator.addRule(rule2, {b: 2});
    validator.validate('the value');

    expect(rule1Called).to.be.true;
    expect(rule2Called).to.be.true;
  });

  it('should return errors of all rules', function () {
    let rule1 = (value, params) => {
      return {valid: false, errors: [{message: '1'}]};
    };

    let rule2 = (value, params) => {
      return {valid: false, errors: [{message: '2'}]};
    };

    let validator = new Validator();
    validator.addRule(rule1);
    validator.addRule(rule2);

    expect(validator.validate()).to.eql({
      valid: false,
      errors: [
        {message: '1'},
        {message: '2'}
      ]
    });
  });

  it('should validate false if only one rule fails', function () {
    let rule1 = (value, params) => {
      return {valid: false, errors: [{message: '1'}]};
    };

    let rule2 = (value, params) => {
      return {valid: true};
    };

    let validator = new Validator();
    validator.addRule(rule1);
    validator.addRule(rule2);

    expect(validator.validate()).to.eql({
      valid: false,
      errors: [
        {message: '1'}
      ]
    });
  });

  it('should return the last converted value', function () {
    let rule1 = (value, params) => {
      return {valid: true, value: 1};
    };

    let rule2 = (value, params) => {
      return {valid: true, value: 2};
    };

    let validator = new Validator();
    validator.addRule(rule1);
    validator.addRule(rule2);

    expect(validator.validate()).to.eql({
      valid: true,
      value: 2
    });
  });

  it('should work with promises', function () {
    let rule1 = (value, params) => {
      return Promise.resolve({valid: true});
    };

    let rule2 = (value, params) => {
      return {valid: true};
    };

    let validator = new Validator();
    validator.addRule(rule1);
    validator.addRule(rule2);

    return validator.validate().then(function (result) {
      expect(result).to.eql({valid: true});
    });
  });
});
