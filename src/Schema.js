
import _ from 'lodash';
import path from 'path';
import requireAll from 'require-all';

let Schema = {};
export default Schema;


Schema.create = function () {
  return _.cloneDeepWith(this, cloneClass);
};

function cloneClass(value) {
  if (value instanceof Function) {
    let Type = new Function(`return function ${value.name}() {};`)();
    Type.prototype = Object.create(value.prototype);
    return Type;
  }
}


Schema.addType = function (Type, name) {
  this[Type.name] = Type;

  if (!name) {
    name = _.camelCase(Type.name);
    let m = name.match(/(.+)Type$/);

    if (m)
      name = m[1];
  }
  
  this[name] = function (params) {
    return new this[Type.name](params);
  };
};


Schema.isSchema = function (obj) {
  return obj instanceof Schema;
};


// load types
let types = requireAll({
  dirname: path.join(__dirname, '/types'),
  resolve: function (module) {
    return module.__esModule ? module.default : module;
  }
});

for (let k in types) {
  Schema.addType(types[k]);
}
