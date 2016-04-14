
import _ from 'lodash';
import AnyType from './AnyType';
import Promise from 'any-promise';
import {error, isEmpty} from '../util';


export default _.merge({}, AnyType, {

  constructor(params) {
    return this._mutate(constructorRule, params);
  },


  keys(schema) {
    return this._mutate(keysRule, {schema});
  }
});


function constructorRule(value, params, ctx) {
  if (isEmpty(value, ctx) || _.isObject(value)) {
    return {valid: true};

  } else {
    return error('expected an object');
  }
}


function keysRule(value, params, ctx) {
  let errors = [];
  let promises = [];

  for (let k in value) {
    let schema = params.schema[k];

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
            value[k] = result.value;

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
    if (errors.length) {
      return {valid: false, errors};
    } else {
      return {valid: true, value};
    }
  }

  if (promises.length) {
    return Promise.all(promises).then(finish);
  } else {
    return finish();
  }
}
