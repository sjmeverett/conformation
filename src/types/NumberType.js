
import _ from 'lodash';
import AnyType from './AnyType';
import {error, isEmpty} from '../util';


export default class NumberType extends AnyType {
  constructor(params) {
    super();
    this.validator.addRule(validate, params);
  }

  integer(pattern) {
    this.validator.addRule(integer);
    return this;
  }
};


function validate(value, params, ctx) {
  if (isEmpty(value, ctx) || _.isNumber(value)) {
    return {valid: true};

  } else if (!ctx.strict && _.isString(value) && value.match(/^[0-9]*\.?[0-9]*$/)) {
    return {valid: true, value: Number.parseFloat(value)};

  } else {
    return error('expected a number');
  }
}


function integer(value, params, ctx) {
  if ((value % 1) === 0) {
    return {valid: true};

  } else {
    return error('expected an integer');
  }
}
