
import _ from 'lodash';
import path from 'path';
import requireAll from 'require-all';

let Schema = {types: {}};
export default Schema;


Schema.create = function () {
  return _.cloneDeep(this);
};


Schema.addType = function (type, name) {
  this.types[name] = type;

  this[name] = function (params) {
    return this.types[name].constructor(params);
  };
};


Schema.isSchema = function (obj) {
  return obj instanceof Schema;
};


// load types
let types = requireAll({
  dirname: path.join(__dirname, '/types'),
  filter: /(.+)Type\.js$/,
  resolve: function (module) {
    return module.__esModule ? module.default : module;
  },
  map: _.camelCase
});

for (let k in types) {
  Schema.addType(types[k], k);
}
