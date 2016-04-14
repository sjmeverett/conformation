
import _ from 'lodash';
import AnyType from './AnyType';
import moment from 'moment';
import {error, isEmpty} from '../util';


export default _.merge({}, AnyType, {

  constructor(params) {
    return this._mutate(constructorRule, params);
  }

});


function constructorRule(value, params, ctx) {
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
