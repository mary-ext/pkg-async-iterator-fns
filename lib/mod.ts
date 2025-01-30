// deno-lint-ignore-file no-explicit-any

/**
 * converts async iterable into an array
 * @param source async iterable to convert
 * @returns a promise that returns to an array of elements yielded by the async iterable
 */
/*#__NO_SIDE_EFFECTS__*/
export async function toArray<T>(source: AsyncIterable<T>): Promise<T[]> {
	const array: T[] = [];

	for await (const value of source) {
		array.push(value);
	}

	return array;
}

/**
 * converts async iterable into a set of unique values
 * @param source async iterable to convert
 * @returns a promise that returns to a set of unique elements yielded by the async iterable
 */
/*#__NO_SIDE_EFFECTS__*/
export async function toSet<T>(source: AsyncIterable<T>): Promise<Set<T>> {
	const set = new Set<T>();

	for await (const value of source) {
		set.add(value);
	}

	return set;
}

/**
 * groups elements from the async iterable according to selector
 * @param source async iterable to group elements from
 * @param keySelector function invoked for each element
 * @returns a promise that returns to a map of grouped elements
 */
/*#__NO_SIDE_EFFECTS__*/
export async function groupBy<V, K>(
	source: AsyncIterable<V>,
	keySelector: (value: V, index: number) => K,
): Promise<Map<K, V[]>> {
	const map = new Map<K, V[]>();
	let index = 0;

	for await (const value of source) {
		const key = keySelector(value, index++);
		const list = map.get(key);

		if (list === undefined) {
			map.set(key, [value]);
		} else {
			list.push(value);
		}
	}

	return map;
}

/**
 * counts the number of elements in an async iterable
 * @param source async iterable to count from
 * @returns a promise that returns to the number of elements in the iterable
 */
/*#__NO_SIDE_EFFECTS__*/
export async function count(source: AsyncIterable<unknown>): Promise<number> {
	let count = 0;

	for await (const _value of source) {
		count++;
	}

	return count;
}

/**
 * returns the first item in an async iterable
 * @param source async iterable to get the first item from
 * @returns a promise that returns the first item, or undefined if empty
 */
/*#__NO_SIDE_EFFECTS__*/
export async function first<T>(
	source: AsyncIterable<T>,
): Promise<T | undefined> {
	for await (const value of source) {
		return value;
	}

	return undefined;
}

/**
 * returns the last item in an async iterable
 * @param source async iterable to get the last item from
 * @returns a promise that returns the last item, or undefined if empty
 */
/*#__NO_SIDE_EFFECTS__*/
export async function last<T>(
	source: AsyncIterable<T>,
): Promise<T | undefined> {
	let last: T | undefined;

	for await (const value of source) {
		last = value;
	}

	return last;
}

/**
 * determines whether all the elements in the async iterable satisfy a given test
 * @param source async iterable to test
 * @param predicate function to test each element with
 * @returns a promise that returns true if all elements passes the test, or false if otherwise.
 */
/*#__NO_SIDE_EFFECTS__*/
export async function every<T>(
	source: AsyncIterable<T>,
	predicate: (value: T, index: number) => unknown,
): Promise<boolean> {
	let index = 0;

	for await (const value of source) {
		if (!predicate(value, index++)) {
			return false;
		}
	}

	return true;
}

/**
 * determines whether one of the elements in the async iterable satisfy a given test
 * @param source async iterable to test
 * @param predicate function to test each element with
 * @returns a promise that returns true if some elements passes the test, or false if otherwise.
 */
/*#__NO_SIDE_EFFECTS__*/
export async function some<T>(
	source: AsyncIterable<T>,
	predicate: (value: T, index: number) => unknown,
): Promise<boolean> {
	let index = 0;

	for await (const value of source) {
		if (predicate(value, index++)) {
			return true;
		}
	}

	return false;
}

/**
 * reduces an async iterable to a single accumulated value
 * @param source async iterable to reduce
 * @param callback reducer function
 * @returns a promise that returns the final accumulated value
 */
export function reduce<T>(
	source: AsyncIterable<T>,
	callback: (accu: T, value: T, index: number) => T,
): Promise<T>;
/**
 * reduces an async iterable to a single accumulated value
 * @param source async iterable to reduce
 * @param callback reducer function
 * @param initialValue initial accumulated value
 * @returns a promise that returns the final accumulated value
 */
export function reduce<T>(
	source: AsyncIterable<T>,
	callback: (accu: T, value: T, index: number) => T,
	initialValue: T,
): Promise<T>;
/**
 * reduces an async iterable to a single accumulated value
 * @param source async iterable to reduce
 * @param callback reducer function
 * @param initialValue initial accumulated value
 * @returns a promise that returns the final accumulated value
 */
export function reduce<T, U>(
	source: AsyncIterable<T>,
	callback: (accu: U, value: T, index: number) => U,
	initialValue: U,
): Promise<U>;
/*#__NO_SIDE_EFFECTS__*/
export async function reduce(
	source: AsyncIterable<any>,
	callback: (accu: any, value: any, index: number) => any,
	accu?: any,
): Promise<any> {
	const hasInitialValue = arguments.length > 2;
	let index = 0;

	for await (const next of source) {
		if (hasInitialValue || index !== 0) {
			accu = callback(accu, next, index);
		} else {
			accu = next;
		}

		index++;
	}

	if (index === 0 && !hasInitialValue) {
		throw new TypeError('reduce of empty async iterable with no initial value');
	}

	return accu;
}

/**
 * finds the first element in the async iterable that satisfy a given test
 * @param source async iterable to search from
 * @param predicate function to test each element with
 * @returns a promise that returns the first matching element, or undefined if none found
 */
export function find<T, S extends T>(
	source: AsyncIterable<T>,
	predicate: (value: T, index: number) => value is S,
): Promise<S | undefined>;
/**
 * finds the first element in the async iterable that satisfy a given test
 * @param source async iterable to search from
 * @param predicate function to test each element with
 * @returns a promise that returns the first matching element, or undefined if none found
 */
export function find<T>(
	source: AsyncIterable<T>,
	predicate: (value: T, index: number) => unknown,
): Promise<T | undefined>;
/*#__NO_SIDE_EFFECTS__*/
export async function find<T>(
	source: AsyncIterable<T>,
	predicate: (value: T, index: number) => unknown,
): Promise<T | undefined> {
	let index = 0;

	for await (const value of source) {
		if (predicate(value, index++)) {
			return value;
		}
	}
}

/**
 * finds the last element in the async iterable that satisfy a given test
 * @param source async iterable to search from
 * @param predicate function to test each element with
 * @returns a promise that returns the last matching element, or undefined if none found
 */
export function findLast<T, S extends T>(
	source: AsyncIterable<T>,
	predicate: (value: T, index: number) => value is S,
): Promise<S | undefined>;
/**
 * finds the last element in the async iterable that satisfy a given test
 * @param source async iterable to search from
 * @param predicate function to test each element with
 * @returns a promise that returns the last matching element, or undefined if none found
 */
export function findLast<T>(
	source: AsyncIterable<T>,
	predicate: (value: T, index: number) => unknown,
): Promise<T | undefined>;
/*#__NO_SIDE_EFFECTS__*/
export async function findLast<T>(
	source: AsyncIterable<T>,
	predicate: (value: T, index: number) => unknown,
): Promise<T | undefined> {
	let last: T | undefined;
	let index = 0;

	for await (const value of source) {
		if (predicate(value, index++)) {
			last = value;
		}
	}

	return last;
}

/**
 * runs callback for each item in the async iterable
 * @param source async iterable to run callback on
 * @param callback callback to run for each elements
 * @returns an async iterator yielding the same elements as the source
 */
/*#__NO_SIDE_EFFECTS__*/
export async function* tap<T>(
	source: AsyncIterable<T>,
	callback: (value: T, index: number) => void,
): AsyncGenerator<T> {
	let index = 0;

	for await (const value of source) {
		callback(value, index++);
		yield value;
	}
}

/**
 * creates a new async iterator yielding elements that satisfy a given test
 * @param source async iterable to filter from
 * @param predicate function to test each element with
 * @returns an async iterator yielding filtered elements
 */
export function filter<T, S extends T>(
	source: AsyncIterable<T>,
	predicate: (value: T, index: number) => value is S,
): AsyncGenerator<S>;
/**
 * creates a new async iterator yielding elements that satisfy a given test
 * @param source async iterable to filter from
 * @param predicate function to test each element with
 * @returns an async iterator yielding filtered elements
 */
export function filter<T>(
	source: AsyncIterable<T>,
	predicate: (value: T, index: number) => unknown,
): AsyncGenerator<T>;
/*#__NO_SIDE_EFFECTS__*/
export async function* filter<T>(
	source: AsyncIterable<T>,
	predicate: (value: T, index: number) => unknown,
): AsyncGenerator<T> {
	let index = 0;

	for await (const value of source) {
		if (predicate(value, index++)) {
			yield value;
		}
	}
}

/**
 * creates a new async iterator yielding transformed eleemnts
 * @param source async iterable to transform
 * @param mapper function to transform each element
 * @returns an async iterator yielding transformed elements
 */
/*#__NO_SIDE_EFFECTS__*/
export async function* map<T, S>(source: AsyncIterable<T>, mapper: (value: T) => S): AsyncGenerator<S> {
	for await (const value of source) {
		yield mapper(value);
	}
}

/**
 * creates a new async iterator that yields the first few elements from source iterable
 * @param source async iterable to take elements from
 * @param amount number of elements to take
 * @returns an async iterator yielding the taken elements
 */
/*#__NO_SIDE_EFFECTS__*/
export async function* take<T>(source: AsyncIterable<T>, amount: number): AsyncGenerator<T> {
	let count = 0;

	for await (const value of source) {
		yield value;

		if (++count >= amount) {
			break;
		}
	}
}

/**
 * creates a new async iterator that yields elements from source iterable, skipping the first few elements
 * @param source async iterable to yield elements from
 * @param amount number of elements to skip
 * @returns an async iterator yielding from provided source iterable
 */
/*#__NO_SIDE_EFFECTS__*/
export async function* skip<T>(source: AsyncIterable<T>, amount: number): AsyncGenerator<T> {
	let count = 0;

	for await (const value of source) {
		if (++count >= amount) {
			continue;
		}

		yield value;
	}
}

type AsyncIteratorNext<T> = [iterator: AsyncIterator<T>, value: IteratorResult<T, undefined>];
function nextResult<T>(iterator: AsyncIterator<T>): Promise<AsyncIteratorNext<T>> {
	return iterator.next().then((result): AsyncIteratorNext<T> => [iterator, result]);
}

/**
 * creates a new async iterator that yields elements from multiple sources
 * @param sources async iterables to merge from
 * @returns an async iterator yielding elements from provided source iterables
 */
/*#__NO_SIDE_EFFECTS__*/
export async function* merge<T>(...sources: AsyncIterable<T>[]): AsyncGenerator<T> {
	const iterators = sources.map((iterable) => iterable[Symbol.asyncIterator]());

	try {
		const pending = new Map(iterators.map((iterator) => [iterator, nextResult(iterator)] as const));

		while (pending.size > 0) {
			const [iterator, result] = await Promise.race(pending.values());

			if (!result.done) {
				yield result.value;

				pending.set(iterator, nextResult(iterator));
			} else {
				pending.delete(iterator);
			}
		}
	} finally {
		await Promise.all(iterators.map((iterator) => iterator.return?.()));
	}
}

/**
 * creates a new async iterator that yields chunks of elements from source itearble
 * @param source async iterable to yield elements from
 * @param size amount of elements in one chunk
 * @returns an async iterator yielding chunked elements
 */
/*#__NO_SIDE_EFFECTS__*/
export async function* chunk<T>(source: AsyncIterable<T>, size: number): AsyncGenerator<T[]> {
	let chunk: T[] = [];
	let amount = 0;

	for await (const item of source) {
		chunk.push(item);

		if (++amount >= size) {
			yield chunk;

			chunk = [];
			amount = 0;
		}
	}

	if (amount > 0) {
		yield chunk;
	}
}

interface QueueNode<T> {
	value: T;
	next: QueueNode<T> | undefined;
}

/**
 * creates two copies of async iterable that can be consumed
 * @param source async iterable to tee from
 * @returns a tuple of two async iterables
 */
/*#__NO_SIDE_EFFECTS__*/
export function tee<T>(source: AsyncIterable<T>): [AsyncIterable<T>, AsyncIterable<T>] {
	const iterator = source[Symbol.asyncIterator]();

	const closed: [boolean, boolean] = [false, false];

	let queue: QueueNode<T> = {
		value: undefined!,
		next: undefined,
	};

	let reading = false;
	let done = false;
	let promise: Promise<void> | undefined;

	async function next(): Promise<void> {
		reading = true;

		const result = await iterator.next();

		if (result.done) {
			done = true;
		} else {
			const node: QueueNode<T> = {
				value: result.value,
				next: undefined,
			};

			queue.next = node;
			queue = node;
		}

		reading = false;
	}

	async function* branch(index: 0 | 1, buffer: QueueNode<T>): AsyncGenerator<T> {
		try {
			while (true) {
				if (buffer.next) {
					buffer = buffer.next;
					yield buffer.value;
				} else if (done) {
					return;
				} else {
					if (!reading) {
						promise = next();
					}

					await promise;
				}
			}
		} finally {
			closed[index] = true;

			if (!done && closed[index ^ 1]) {
				await iterator.return?.();
			}
		}
	}

	return [branch(0, queue), branch(1, queue)];
}
