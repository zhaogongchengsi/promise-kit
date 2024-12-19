import { describe, it, expect, vi } from 'vitest';
import { forEach, map, parallel } from './array';

describe('forEach', () => {
	it('should call the callback function for each element in the array', async () => {
		const arr = [1, 2, 3];
		const callback = vi.fn();

		await forEach(arr, callback);

		expect(callback).toHaveBeenCalledTimes(3);
		expect(callback).toHaveBeenCalledWith(1, 0, arr);
		expect(callback).toHaveBeenCalledWith(2, 1, arr);
		expect(callback).toHaveBeenCalledWith(3, 2, arr);
	});

	it('should handle asynchronous callback functions', async () => {
		const arr = [1, 2, 3];
		const callback = vi.fn().mockResolvedValue(undefined);

		await forEach(arr, callback);

		expect(callback).toHaveBeenCalledTimes(3);
	});
});

describe('map', () => {
	it('should map each element in the array using the callback function', async () => {
		const arr = [1, 2, 3];
		const callback = (value: number) => value * 2;

		const result = await map(arr, callback);

		expect(result).toEqual([2, 4, 6]);
	});

	it('should handle asynchronous callback functions', async () => {
		const arr = [1, 2, 3];
		const callback = async (value: number) => value * 2;

		const result = await map(arr, callback);

		expect(result).toEqual([2, 4, 6]);
	});
});


describe('parallel', () => {
	it('should process elements concurrently with the specified concurrency limit', async () => {
		const arr = [1, 2, 3, 4, 5];
		const callback = vi.fn(async (value: number) => value * 2);
		const concurrency = 2;

		const result = await parallel(arr, callback, concurrency);

		expect(result).toEqual([2, 4, 6, 8, 10]);
		expect(callback).toHaveBeenCalledTimes(5);
	});

	it('should handle asynchronous callback functions', async () => {
		const arr = [1, 2, 3, 4, 5];
		const callback = async (value: number) => value * 2;
		const concurrency = 2;

		const result = await parallel(arr, callback, concurrency);

		expect(result).toEqual([2, 4, 6, 8, 10]);
	});

	it('should respect the concurrency limit', async () => {
		const arr = [1, 2, 3, 4, 5];
		const callback = vi.fn(async (value: number) => {
			await new Promise(resolve => setTimeout(resolve, 100));
			return value * 2;
		});
		const concurrency = 2;

		const start = Date.now();
		await parallel(arr, callback, concurrency);
		const duration = Date.now() - start;

		expect(duration).toBeGreaterThanOrEqual(200);
		expect(callback).toHaveBeenCalledTimes(5);
	});
});