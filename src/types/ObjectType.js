
import _ from 'lodash';
import AnyType from './AnyType';
import Promise from 'any-promise';
import {error, isEmpty} from '../util';


export default _.merge({}, AnyType, {

  constructor(params) {
    return this.rule(constructorRule, params);
  },


  keys(schema) {
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
  let errors = [];
  let promises = [];
  let ctx = _.cloneDeep(_ctx);
  ctx.parent = value;
  ctx.converted = {};

  let path = ctx.path ? (ctx.path + '.') : '';

  for (let k in value) {
    let schema = params.schema[k];
    ctx.key = k;
    ctx.path = path + k;

    if (!schema) {
      errors.push({
        message: 'unexpected key ' + k,
        path: k
      });

    } else {
      let result = schema.validate(value[k], ctx);

      function handleResult(result) {
        if (result.valid) {
          if (result.hasOwnProperty('value'))
            ctx.converted[k] = result.value;
          else
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
