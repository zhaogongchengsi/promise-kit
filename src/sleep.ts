
/**
 * Pauses the execution of an asynchronous function for a specified duration.
 *
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified duration.
 */
export function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Pauses the execution of an asynchronous function for a random duration within a specified range.
 *
 * @param minMs - The minimum number of milliseconds to sleep.
 * @param maxMs - The maximum number of milliseconds to sleep.
 * @returns A promise that resolves after a random duration within the specified range.
 */
export function randomSleep(minMs: number, maxMs: number): Promise<void> {
	const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
	return sleep(duration);
}
