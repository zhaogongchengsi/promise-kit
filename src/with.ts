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
/**
 * Retries a promise-returning function a specified number of times if it fails.
 *
 * @template T - The type of the value that the promise resolves to.
 * @param {() => Promise<T>} fn - The promise-returning function to retry.
 * @param {number} retries - The number of times to retry the function.
 * @returns {Promise<T>} A promise that resolves with the result of the function,
 * or rejects with the last error encountered after all retries have been exhausted.
 */
export async function withRetry<T>(fn: () => Promise<T>, retries: number): Promise<T> {
	let attempt = 0;
	while (attempt < retries) {
		try {
			return await fn();
		} catch (error) {
			attempt++;
			if (attempt >= retries) {
				throw error;
			}
		}
	}
	throw new Error('Retries exhausted');
}

/**
 * Executes a function that returns a value or a promise, and returns a promise that resolves with the function's result.
 * If the function throws an error or the promise is rejected, the error is caught and rethrown.
 *
 * @template T - The type of the value returned by the function or the resolved value of the promise.
 * @template A - The types of the arguments passed to the function.
 * @param {(...args: A[]) => (T | Promise<T>)} fn - The function to be executed.
 * @param {...A[]} args - The arguments to be passed to the function.
 * @returns {Promise<T>} A promise that resolves with the result of the function or rejects with an error.
 * @throws Will rethrow any error thrown by the function or any rejection from the promise.
 */
export async function withRry<T, A>(fn: (...args: A[]) => (T | Promise<T>), ...args: A[]): Promise<T> {
	try {
		return await Promise.resolve(fn(...args));
	} catch (error) {
		throw error;
	}
}