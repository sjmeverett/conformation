
import _ from 'lodash';
import AnyType from './AnyType';
import {error, isEmpty} from '../util';


export default _.merge({}, AnyType, {

  constructor(params) {
    return this._mutate(constructorRule, params);
  },


  items(schema) {
    return this._mutate(itemsRule, {schema});
  },


  length(length) {
    return this._mutate(lengthRule, {length});
  }

});


function constructorRule(value, params, ctx) {
  if (isEmpty(value, ctx) || _.isArray(value)) {
    return {valid: true};

  } else {
    return error('expected an array');
  }
}


function itemsRule(value, params, ctx) {
  let errors = [];
  let promises = [];

  for (let i in value) {
    let result = params.schema.validate(value[i], ctx);

    function handleResult(result) {
      if (result.valid) {
        if (result.hasOwnProperty('value'))
          value[i] = result.value;

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


function lengthRule(value, params, context) {
  if (value.length === params.length) {
    return {valid: true};

  } else {
    return error('expected array to have length ' + params.length);
  }
}
