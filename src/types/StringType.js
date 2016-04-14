
import _ from 'lodash';
import AnyType from './AnyType';
import {error, isEmpty} from '../util';


export default _.merge({}, AnyType, {

  constructor(params) {
    return this._mutate(constructorRule, params);
  },


  regex(pattern) {
    return this._mutate(regexRule, {pattern});
  }

});


function constructorRule(value, params, ctx) {
  if (isEmpty(value, ctx) || _.isString(value)) {
    return {valid: true};

  } else {
    return error('expected string');
  }
}


function regexRule(value, params, ctx) {
  if (isEmpty(value, ctx) || value.match(params.pattern)) {
    return {valid: true};

  } else {
    return error('expected value to match regex ' + params.pattern.toString());
  }
}
