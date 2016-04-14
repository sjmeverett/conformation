
import _ from 'lodash';


export function isEmpty(value, ctx) {
  return _.isNil(value) || (!ctx.strict && value === '');
};

export function error(message) {
  return {
    valid: false,
    errors: [
      {message}
    ]
  }
};
