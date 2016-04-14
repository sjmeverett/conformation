
import _ from 'lodash';
import AnyType from './AnyType';
import {error, isEmpty} from '../util';


export default class ArrayType extends AnyType {
  constructor(params) {
    super();
    this.validator.addRule(validate, params);
  }

  items(schema) {
    this.validator.addRule(items, {schema})
    return this;
  }

  length(n) {
    this.validator.addRule(length, {length: n});
    return this;
  }
};


function validate(value, params, ctx) {
  if (isEmpty(value, ctx) || _.isArray(value)) {
    return {valid: true};

  } else {
    return error('expected an array');
  }
}


function items(value, params, ctx) {
  let errors = [];
  let promises = [];

  for (let i in value) {
    let result = params.schema.validator.validate(value[i], ctx);

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


function length(value, params, context) {
  if (value.length === params.length) {
    return {valid: true};

  } else {
    return error('expected array to have length ' + params.length);
  }
}
