# promise-kit

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]

Some promise extension functions

## Install

use pnpm to install

```sh
npm i @zunh/promise-kit
pnpm add @zunh/promise-kit
```

## API

### `withTimeout`

```typescript
await withTimeout(Promise.resolve('success'), 1000)
```

### `withResolvers`

```typescript
const { resolve, promise } = withResolvers<string>();
resolve('success');
const result = await promise;
```

### `withRetry`

```typescript
await withRetry(async () => {
  return 'success';
}, 3, 1000);
```

### `forEach`

```typescript
await forEach([1, 2, 3], async (item) => {
  item + 1;
});
```

### `map`

```typescript
const result = await map([1, 2, 3], async (item) => {
  return item + 1;
});
```

### `parallel`

```typescript
await parallel([1,2,3], async () => {}, 2);
```

### `sleep`

```typescript
await sleep(1000);
```

### `randomSleep`

```typescript
await randomSleep(1000, 2000);
```

### `Task`

```typescript
const { run, waitComplete, pause, resume } = createTask([1,2,4])

run(async (item) => {
  return item + 1;
})

pause()

resume()

const result = await waitComplete()
```

## License

[MIT](./LICENSE) License © 2023-PRESENT [zhaozunhong](https://github.com/zhaozunhong)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@zunh/promise-kit?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/@zunh/promise-kit
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@zunh/onion?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=@zunh/promise-kit
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/@zunh/promise-kit
