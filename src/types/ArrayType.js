
import _ from 'lodash';
import AnyType from './AnyType';
import {error, isEmpty} from '../util';


export default _.merge({}, AnyType, {

  constructor(params) {
    return this.rule(constructorRule, params);
  },


  items(schema) {
    return this.rule(itemsRule, {schema});
  },


  length(length) {
    return this.rule(lengthRule, {length});
  }

});


function constructorRule(value, params, ctx) {
  if (isEmpty(value, ctx) || _.isArray(value)) {
    return {valid: true};

  } else {
    return error('expected an array');
  }
}


function itemsRule(value, params, _ctx) {
  let errors = [];
  let promises = [];
  let ctx = _.cloneDeep(_ctx);
  ctx.parent = value;
  ctx.converted = {};

  let path = ctx.path ? (ctx.path + '.') : '';

  for (let i in value) {
    ctx.key = i;
    ctx.path = path + i;

    let result = params.schema.validate(value[i], ctx);

    function handleResult(result) {
      if (result.valid) {
        if (result.hasOwnProperty('value'))
          ctx.converted[i] = result.value;
        else
          ctx.converted[i] = value[i];

      } else {
        [].push.apply(errors, result.errors.map((error) => {
          if (error.path) {
            error.path = i + '.' + error.path;
          } else {
            error.path = i;
          }

          return error;
        }));
      }
    }

    if (result.then) {
      promises.push(result.then(handleResult));
    } else {
      handleResult(result);
    }
  }

  function finish() {
    _.merge(_ctx, _.omit(ctx, ['parent', 'key', 'converted']));

    if (errors.length) {
      return {valid: false, errors};
    } else {
      return {valid: true, value: ctx.converted};
    }
  }

  if (promises.length) {
    return Promise.all(promises).then(finish);
  } else {
    return finish();
  }
}


function lengthRule(value, params, context) {
  if (value.length === params.length) {
    return {valid: true};

  } else {
    return error('expected array to have length ' + params.length);
  }
}
