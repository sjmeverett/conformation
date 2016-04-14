
import _ from 'lodash';
import AnyType from './AnyType';
import moment from 'moment';
import {error, isEmpty} from '../util';


export default class DateType extends AnyType {
  constructor(params) {
    super();
    this.validator.addRule(validate, params);
  }
};


function validate(value, params, ctx) {
  if (isEmpty(value, ctx) || _.isDate(value)) {
    return {valid: true};

  } else if ((!ctx.strict || ctx.strict === 'semi')
      && params.format
      && (value = moment(value, params.format, params.strict)).isValid()) {

    return {valid: true, value: value.toDate()};

  } else if (!this.strict && params.format) {
    return error('expected a string in the format ' + params.format);

  } else {
    return error('expected a date');
  }
};
