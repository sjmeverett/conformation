
import _ from 'lodash';
import Validator from '../Validator';
import {error} from '../util';


export default class AnyType {
  constructor() {
    this.validator = new Validator();
  }

  required() {
    this.validator.addRule(required)
    return this;
  }

  validate(value, context) {
    return this.validator.validate(value, context);
  }
};


function required(value) {
  if (_.isNil(value) || value === '') {
    return error('required');

  } else {
    return {valid: true};
  }
}
