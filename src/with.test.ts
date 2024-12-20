import { describe, it, expect } from 'vitest';
import { withTimeout, withResolvers, withRetry, withRry } from './with';

describe('with', () => {
	it('should resolve the promise if it completes before the timeout', async () => {
		const result = await withTimeout(Promise.resolve('success'), 1000);
		expect(result).toBe('success');
	});

	it('should reject with a TimeoutError if the promise does not complete before the timeout', async () => {
		const promise = new Promise((resolve) => setTimeout(resolve, 2000));
		await expect(withTimeout(promise, 1000)).rejects.toThrow('Timeout of 1000ms exceeded');
	});

	it('should resolve the promise if it completes exactly at the timeout', async () => {
		const result = await withTimeout(new Promise((resolve) => setTimeout(() => resolve('success'), 1000)), 1000);
		expect(result).toBe('success');
	});

	it('should reject with a TimeoutError if the timeout is 0', async () => {
		const promise = new Promise((resolve) => setTimeout(resolve, 1000));
		await expect(withTimeout(promise, 0)).rejects.toThrow('Timeout of 0ms exceeded');
	});

	it('should handle rejected promises correctly', async () => {
		const promise = Promise.reject(new Error('failure'));
		await expect(withTimeout(promise, 1000)).rejects.toThrow('failure');
	});

	it('should return an object with resolve, reject, and promise properties', () => {
		const { resolve, reject, promise } = withResolvers<string>();
		expect(typeof resolve).toBe('function');
		expect(typeof reject).toBe('function');
		expect(promise).toBeInstanceOf(Promise);
	});

	it('should resolve the promise when resolve is called', async () => {
		const { resolve, promise } = withResolvers<string>();
		resolve('success');
		const result = await promise;
		expect(result).toBe('success');
	});

	it('should reject the promise when reject is called', async () => {
		const { reject, promise } = withResolvers<string>();
		reject(new Error('failure'));
		await expect(promise).rejects.toThrow('failure');
	});

	it('should retry the function if it fails and eventually succeed', async () => {
		let attempts = 0;
		const result = await withRetry(() => {
			attempts++;
			if (attempts < 3) {
				return Promise.reject(new Error('failure'));
			}
			return Promise.resolve('success');
		}, 3);
		expect(result).toBe('success');
		expect(attempts).toBe(3);
	});

	it('should throw an error if the function fails all retries', async () => {
		let attempts = 0;
		await expect(withRetry(() => {
			attempts++;
			return Promise.reject(new Error('failure'));
		}, 3)).rejects.toThrow('failure');
		expect(attempts).toBe(3);
	});

	it('should retry the function if it fails and eventually succeed after multiple attempts', async () => {
		let attempts = 0;
		const result = await withRetry(() => {
			attempts++;
			if (attempts < 5) {
				return Promise.reject(new Error('failure'));
			}
			return Promise.resolve('success');
		}, 5);
		expect(result).toBe('success');
		expect(attempts).toBe(5);
	});

	it('should resolve with the function result', async () => {
		const result = await withRry((a: number, b: number) => a + b, 1, 2);
		expect(result).toBe(3);
	});

	it('should resolve with the promise result', async () => {
		const result = await withRry((a: number, b: number) => Promise.resolve(a + b), 1, 2);
		expect(result).toBe(3);
	});

	it('should throw an error if the function throws', async () => {
		await expect(withRry(() => { throw new Error('failure'); })).rejects.toThrow('failure');
	});

	it('should throw an error if the promise is rejected', async () => {
		await expect(withRry(() => Promise.reject(new Error('failure')))).rejects.toThrow('failure');
	});
});