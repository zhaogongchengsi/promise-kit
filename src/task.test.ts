import { describe, it, expect, vi } from 'vitest';
import { createTaskRunner } from './task';

describe.todo('createTaskRunner', () => {
	it('should run tasks with specified concurrency', async () => {
		const items = [1, 2, 3, 4, 5];
		const concurrency = 2;
		const executor = vi.fn(async (item: number) => {
			await new Promise(resolve => setTimeout(resolve, 100));
		});

		const taskRunner = createTaskRunner(items, concurrency);
		const controller = taskRunner(executor);

		await new Promise(resolve => setTimeout(resolve, 600)); // Wait for all tasks to complete

		expect(executor).toHaveBeenCalledTimes(items.length);
	});

	it('should pause and resume tasks', async () => {
		const items = [1, 2, 3, 4, 5];
		const concurrency = 2;
		const executor = vi.fn(async (item: number) => {
			await new Promise(resolve => setTimeout(resolve, 100));
		});

		const taskRunner = createTaskRunner(items, concurrency);
		const controller = taskRunner(executor);

		controller.pause();
		await new Promise(resolve => setTimeout(resolve, 200)); // Wait to ensure tasks are paused

		expect(executor).toHaveBeenCalledTimes(2); // Only the first two tasks should have started

		controller.resume();
		await new Promise(resolve => setTimeout(resolve, 600)); // Wait for all tasks to complete

		expect(executor).toHaveBeenCalledTimes(items.length);
	});

	it('should cancel tasks', async () => {
		const items = [1, 2, 3, 4, 5];
		const concurrency = 2;
		const executor = vi.fn(async (item: number) => {
			await new Promise(resolve => setTimeout(resolve, 100));
		});

		const taskRunner = createTaskRunner(items, concurrency);
		const controller = taskRunner(executor);

		controller.cancel();
		await new Promise(resolve => setTimeout(resolve, 200)); // Wait to ensure tasks are cancelled

		expect(executor).toHaveBeenCalledTimes(0); // No tasks should have been executed
	});
});