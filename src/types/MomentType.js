
import _ from 'lodash';
import AnyType from './AnyType';
import moment from 'moment';
import {error, isEmpty} from '../util';


export default _.merge({}, AnyType, {

  constructor(params) {
    return this.rule(constructorRule, params);
  },


  date() {
    return this.rule(dateRule);
  },


  format(format) {
    return this.rule(formatRule, {format});
  }
});


function constructorRule(value, params, ctx) {
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
}


function dateRule(value) {
  return {valid: true, value: value.toDate()};
}


function formatRule(value, params) {
  return {valid: true, value: value.format(params.format)};
}
