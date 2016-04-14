
# Conformation

Kinda like JOI, but with promises and more pluggable.

## Example

```js
import Schema from 'conformation';

let schema = Schema.object().keys({
  foo: Schema.string().required(),
  bar: Schema.number(),
  date: Schema.moment({format: 'DD/MM/YYYY'})
});

schema.validate({foo: 'hello', bar: 5, date: '14/04/2016'});
```

TODO...
