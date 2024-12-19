export async function forEach<T>(arr: T[], callbackfn: (value: T, index: number, array: T[]) => (void | Promise<void>), thisArg?: any) {
	let i = 0;
	for (const item of arr) {
		await Promise.resolve(callbackfn.call(thisArg, item, i++, arr));
	}
}

export async function map<T, U>(arr: T[], callbackfn: (value: T, index: number, array: T[]) => U | Promise<U>, thisArg?: any): Promise<U[]> {
	let i = 0;
	const result: U[] = [];
	for (const item of arr) {
		result.push(await Promise.resolve(callbackfn.call(thisArg, item, i++, arr)));
	}
	return result;
}


/**
 * Executes a provided function concurrently on each element of an array, with a specified concurrency limit.
 *
 * @template T - The type of the elements in the input array.
 * @template U - The type of the elements in the resulting array.
 * 
 * @param {T[]} arr - The array of elements to process.
 * @param {(value: T, index: number, array: T[]) => U | Promise<U>} callbackfn - The function to execute on each element.
 * @param {number} concurrency - The maximum number of concurrent executions.
 * @param {any} [thisArg] - Optional. Value to use as `this` when executing `callbackfn`.
 * 
 * @returns {Promise<U[]>} A promise that resolves to an array of results after all elements have been processed.
 */
export async function parallel<T, U>(arr: T[], callbackfn: (value: T, index: number, array: T[]) => U | Promise<U>, concurrency: number, thisArg?: any): Promise<U[]> {
	const result: U[] = [];
	const executing: Promise<void>[] = [];
	let i = 0;

	for (const item of arr) {
		const p = Promise.resolve(callbackfn.call(thisArg, item, i++, arr)).then(res => {
			result.push(res);
		});
		executing.push(p);

		if (executing.length >= concurrency) {
			await Promise.race(executing);
			executing.splice(executing.findIndex(p => p === p), 1);
		}
	}

	await Promise.all(executing);
	return result;
}