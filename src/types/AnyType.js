
import _ from 'lodash';
import {error} from '../util';


export default {
  rules: [],

  rule(rule, params) {
    return _.mergeWith({}, this, {rules: [{rule, params}]}, mergeArray);
  },


  constructor() {
    return _.merge({}, this);
  },


  required() {
    return this.rule(requiredRule);
  },


  only(values) {
    if (!_.isArray(values))
      values = [].slice.apply(arguments);

    return this.rule(onlyRule, {values});
  },


  validate(value, context) {
    let errors = [];
    let promises = [];
    let cast = false;
    context = _.isObject(context) ? context : {value, strict: context || false};

    function handleResult(result) {
      if (!result.valid) {
        [].push.apply(errors, result.errors);

      } else if (result.hasOwnProperty('value')) {
        value = result.value;
        cast = true;
      }
    }

    function finish() {
      if (errors.length) {
        return {valid: false, errors};
      } else if (cast) {
        return {valid: true, value};
      } else {
        return {valid: true}
      }
    }

    for (let rule of this.rules) {
      let result = rule.rule(value, rule.params || {}, context);

      if (result.then) {
        promises.push(result.then(handleResult));
      } else {
        handleResult(result);
      }
    }

    if (promises.length) {
      return Promise.all(promises).then(finish);
    } else {
      return finish();
    }
  }
};


function requiredRule(value, params, ctx) {
  if (ctx.skipRequired || !(_.isNil(value) || value === '')) {
    return {valid: true};

  } else {
    return error('required');
  }
}


function onlyRule(value, params, ctx) {
  if (_.isNil(value) || value === '' || _.includes(params.values, value)) {
    return {valid: true};

  } else {
    return error('expected one of ' + params.values);
  }
}


function mergeArray(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}
