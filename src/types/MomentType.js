
import AnyType from './AnyType';
import moment from 'moment';
import {error, isEmpty} from '../util';


export default class MomentType extends AnyType {
  constructor(params) {
    super();
    this.validator.addRule(validate, params);
  }

  date() {
    this.validator.addRule(date);
    return this;
  }

  format(fmt) {
    this.validator.addRule(format, {format: fmt})
    return this;
  }
};


function validate(value, params, ctx) {
  if (isEmpty(value, ctx) || moment.isMoment(value)) {
    return {valid: true};

  } else if ((!ctx.strict || ctx.strict === 'semi')
      && params.format
      && (value = moment(value, params.format, params.strict)).isValid()) {

    return {valid: true, value};

  } else if (!ctx.strict) {
    return error('expected a string in the format ' + params.format);

  } else {
    return error('expected a moment');
  }
};

function date(value) {
  return {valid: true, value: value.toDate()};
}

function format(value, paramz) {
  return {valid: true, value: value.format(params.format)};
}
