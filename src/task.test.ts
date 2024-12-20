import { describe, it, expect, vi } from 'vitest';
import { createTask } from './task';

describe('createTask', () => {
	it('should create a Task instance with the provided list', () => {
		const list = [1, 2, 3];
		const task = createTask(list);
		expect(task).toBeInstanceOf(Object);
		expect(task.list).toEqual(list);
	});

	it('should wait for the task to complete', async () => {
		const list = [1, 2, 3];
		const task = createTask(list);
		const actuator = vi.fn();
		task.run(actuator);

		await task.waitComplete();

		expect(actuator).toHaveBeenCalledTimes(3);
	});

	it('should pause the task', async () => {
		const list = [1, 2, 3];
		const task = createTask(list);
		const actuator = vi.fn();
		task.run(actuator);

		task.pause();
		task.cancel();

		expect(actuator).toHaveBeenCalledTimes(1);
	});

	it('should cancel the task', async () => {
		const list = [1, 2, 3];
		const task = createTask(list);
		const actuator = vi.fn();
		task.run(actuator);

		task.cancel();

		expect(actuator).toHaveBeenCalledTimes(1);
	});

	it('should continue the task', async () => {
		const list = [1, 2, 3];
		const task = createTask(list);
		const actuator = vi.fn();
		task.run(actuator);

		task.pause();

		expect(actuator).toHaveBeenCalledTimes(1);

		task.resume();

		await task.waitComplete();

		expect(actuator).toHaveBeenCalledTimes(3);
	});

	it('should the number of successes and failures should be counted', async () => {
		const list = [1, 2, 3];
		const task = createTask(list);
		const actuator = vi.fn();
		task.run(actuator);

		const { success, failure } = await task.waitComplete();

		expect(success).toEqual([1, 2, 3]);
		expect(failure).toEqual([]);
	})
});
