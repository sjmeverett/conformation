
import _ from 'lodash';
import AnyType from './AnyType';
import {error, isEmpty} from '../util';


export default _.merge({}, AnyType, {

  constructor(params) {
    return this._mutate(constructorRule, params);
  },


  integer() {
    return this._mutate(integerRule);
  }
});


function constructorRule(value, params, ctx) {
  if (isEmpty(value, ctx) || _.isNumber(value)) {
    return {valid: true};

  } else if (!ctx.strict && _.isString(value) && value.match(/^[0-9]*\.?[0-9]*$/)) {
    return {valid: true, value: Number.parseFloat(value)};

  } else {
    return error('expected a number');
  }
}


function integerRule(value, params, ctx) {
  if ((value % 1) === 0) {
    return {valid: true};

  } else {
    return error('expected an integer');
  }
}
