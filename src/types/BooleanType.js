
import _ from 'lodash';
import AnyType from './AnyType';
import {error, isEmpty} from '../util';


export default _.merge({}, AnyType, {

  constructor(params) {
    return this._mutate(constructorRule, params);
  }

});


function constructorRule(value, params, ctx) {
  if (isEmpty(value, ctx) || _.isBoolean(value)) {
    return {valid: true};

  } else if (!ctx.strict && _.isString(value) && (value === 'true' || value === 'false')) {
    return {valid: true, value: value === 'true'};

  } else {
    return error('expected a boolean');
  }
}
