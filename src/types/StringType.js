
import _ from 'lodash';
import AnyType from './AnyType';
import {error, isEmpty} from '../util';


export default class StringType extends AnyType {
  constructor(params) {
    super();
    this.validator.addRule(validate, params);
  }

  regex(pattern) {
    this.validator.addRule(regex, {pattern});
    return this;
  }
};


function validate(value, params, ctx) {
  if (isEmpty(value, ctx) || _.isString(value)) {
    return {valid: true};

  } else {
    return error('expected string');
  }
}


function regex(value, params, ctx) {
  if (isEmpty(value, ctx) || value.match(params.pattern)) {
    return {valid: true};

  } else {
    return error('expected value to match regex ' + params.pattern.toString());
  }
}
