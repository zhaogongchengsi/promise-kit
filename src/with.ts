/**
 * Returns a promise that resolves or rejects with the result of the given promise,
 * or rejects with a timeout error if the given promise does not settle within the specified timeout.
 *
 * @template T - The type of the value that the promise resolves to.
 * @param {Promise<T>} promise - The promise to race against the timeout.
 * @param {number} [timeout=5000] - The timeout in milliseconds. Defaults to 5000ms.
 * @returns {Promise<T>} A promise that resolves or rejects with the result of the given promise,
 * or rejects with a timeout error if the given promise does not settle within the specified timeout.
 * @throws {Error} Throws a TimeoutError if the promise does not settle within the specified timeout.
 */
export async function withTimeout<T>(promise: Promise<T>, timeout: number = 5000): Promise<T> {
	return Promise.race([
		promise,
		new Promise<T>((_, reject) => setTimeout(() => {
			const err = new Error(`Timeout of ${timeout}ms exceeded`);
			err.name = 'TimeoutError'
			reject(err);
		}, timeout))
	]);
}

/**
 * Creates a new Promise along with its resolve and reject functions.
 * 
 * This function returns an object containing:
 * - `promise`: The created Promise.
 * - `resolve`: The resolve function to resolve the Promise.
 * - `reject`: The reject function to reject the Promise.
 * 
 * If the `Promise.withResolvers` method is available, it will be used to create the Promise and its resolvers.
 * 
 * @template T The type of the value that the Promise will resolve with.
 * @returns {PromiseWithResolvers<T>} An object containing the Promise and its resolve and reject functions.
 */
export function withResolvers<T>(): PromiseWithResolvers<T> {
	if (Promise.withResolvers) {
		return Promise.withResolvers<T>()
	}

	let resolve: (value: T | PromiseLike<T>) => void = () => {};
	let reject: (reason?: any) => void = () => {};
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return { resolve, reject, promise };
}

