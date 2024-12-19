# promise-kit

Some promise extension functions

## 安装

use pnpm to install

```sh
pnpm install
```

API

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

### `forEach`

```typescript
const result = await forEach([1, 2, 3], async (item) => {
  return item + 1;
});
```

### `map`

```typescript
const result = await map([1, 2, 3], async (item) => {
  return item + 1;
});
```
