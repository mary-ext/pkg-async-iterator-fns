# async-iterator-fns

small async iterator utilities

```ts
async function* numbers() {
	yield* [1, 2, 3];
}

const result = await toArray(filter(map(numbers(), (x) => x * 2), (x) => x > 2));
//    ^? [4, 6]

const result = await reduce(numbers(), (a, b) => a + b);
//    ^? 6
```
