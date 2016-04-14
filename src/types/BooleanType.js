
import _ from 'lodash';
import AnyType from './AnyType';
import {error, isEmpty} from '../util';


export default class BooleanType extends AnyType {
  constructor(params) {
    super();
    this.validator.addRule(validate, params);
  }
};


function validate(value, params, ctx) {
  if (isEmpty(value, ctx) || _.isBoolean(value)) {
    return {valid: true};

  } else if (!ctx.strict && _.isString(value) && (value === 'true' || value === 'false')) {
    return {valid: true, value: value === 'true'};

  } else {
    return error('expected a boolean');
  }
}
