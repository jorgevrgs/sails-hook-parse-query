# sails-hook-parse-query

A helper to parse request queries and params

## Add

### Request

Route: `PUT /api/v1/users/:id/:association/:fk`

```
PUT /api/v1/products/1/accessories
Autorization: Bearer {{jwtToken}}

{
  "id": 1,
  "association": 'pets',
  "fk": 2,
}
```

### Actions

```js
module.exports = {
  ...
  inputs: {
    id: {
      type: 'string',
      required: true,
    },
    association: {
      type: 'number',
      required: true,
    },
    fk: {
      type: 'string',
      required: true,
    }
  },
  fn: function(inputs, exits, ctx) {
    const model = 'user';
    const query = ;
    const filter = await sails.helpers.parse.query(model, 'add', {}, inputs);
      .intercept('badRequest', 'badRequest')
      .intercept('notFound', 'notFound');

    const updatedUser = await sails.helpers.actions.find(filter)
      .intercept('notFound', 'notFound');

    return ctx.res.ok(updatedUser);
  }
};
```

## Create

### Request

```
POST /api/v1/products
Autorization: Bearer {{jwtToken}}

{
  "name": "iPhone",
  "price": 999.99
}
```

### Actions

```js
module.exports = {
  ...
  inputs: {
    name: {
      type: 'string',
      required: true,
    },
    pice: {
      type: 'number',
      required: true,
    }
  },
  fn: function(inputs, exits, ctx) {
    const model = 'product';
    const query = {};
    const filter = await sails.helpers.parse.query(model, 'add', {}, inputs);
      .intercept('badRequest', 'badRequest')
      .intercept('notFound', 'notFound');

    const res = await sails.helpers.actions.add(filter)
      .intercept('notFound', 'notFound');

    return ctx.res.ok(res);
  }
};
```

## Find

### Request

```
GET /api/v1/products?page=2&perPage=10
```

### Actions

```js
module.exports = {
  ...
  fn: function(inputs, exits, ctx) {
    const model = 'product';
    const query = ctx.req.query;
    const filter = await sails.helpers.parse.query(model, 'find', query);
      .intercept('badRequest', 'badRequest')
      .intercept('notFound', 'notFound');

    const { list, count } = await sails.helpers.actions.find(filter)
      .intercept('notFound', 'notFound');

    // Response with count in header
    // ctx.res.set('X-Total-Count', count)
    // retrun ctx.res.ok(list);

    // Response with a nested object
    return ctx.res.ok({data: list, count});
  }
};
```
