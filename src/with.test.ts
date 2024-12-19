import { describe, it, expect } from 'vitest';
import { withTimeout, withResolvers } from './with';

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
});