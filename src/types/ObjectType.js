
import _ from 'lodash';
import AnyType from './AnyType';
import Promise from 'any-promise';
import {error, isEmpty} from '../util';


export default _.merge({}, AnyType, {

  constructor(params) {
    return this.rule(constructorRule, params);
  },


  keys(schema) {
    this.keySchemas = schema;
    return this.rule(keysRule, {schema});
  }
});


function constructorRule(value, params, ctx) {
  if (isEmpty(value, ctx) || _.isObject(value)) {
    return {valid: true};

  } else {
    return error('expected an object');
  }
}


function keysRule(value, params, _ctx) {
  if (isEmpty(value, _ctx))
    return {valid: true};

  let errors = [];
  let promises = [];
  let ctx = _.clone(_ctx);
  ctx.parent = value;
  ctx.converted = {};

  let path = ctx.path ? (ctx.path + '.') : '';

  for (let k in params.schema) {
    let schema = params.schema[k];
    ctx.key = k;
    ctx.path = path + k;

    let result = schema.validate(value[k], ctx);

    function handleResult(result) {
      if (result.valid) {
        if (result.hasOwnProperty('value'))
          ctx.converted[k] = result.value;
        else if (value.hasOwnProperty(k))
          ctx.converted[k] = value[k];

      } else {
        [].push.apply(errors, result.errors.map((error) => {
          if (error.path) {
            error.path = k + '.' + error.path;
          } else {
            error.path = k;
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

  let difference = _.difference(_.keys(value), _.keys(params.schema));

  if (difference.length) {
    [].push.apply(errors, difference.map((key) => ({
      message: 'unexpected key ' + key,
      path: key
    })));
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
