type Executor<T> = (item: T) => Promise<void>;

interface TaskController {
	cancel: () => void;
	resume: () => void;
	pause: () => void;
}

export function createTaskRunner<T>(items: T[], concurrency: number): (executor: Executor<T>) => TaskController {
	let isPaused = false;
	let isCancelled = false;
	let runningTasks: Promise<void>[] = [];
	let resolvePause: () => void;

	const pausePromise = new Promise<void>(resolve => {
		resolvePause = resolve;
	});

	const run = async (executor: Executor<T>): Promise<void> => {
		const iterator = items[Symbol.iterator]();

		const runNext = async (): Promise<void> => {
			if (isPaused) await pausePromise;
			if (isCancelled) return;

			const { value, done } = iterator.next();
			if (done) return;

			const task = executor(value).then(() => {
				if (!isCancelled) {
					runNext();
				}
			});
			if (!isCancelled) {
				runningTasks.push(task);
			}

			if (runningTasks.length >= concurrency) {
				await Promise.race(runningTasks);
				runningTasks = runningTasks.filter(t => t !== task);
			}
		};

		await Promise.all(Array.from({ length: concurrency }, () => {
			if (isCancelled) return;
			runNext();
		}));
	};

	return (executor: Executor<T>): TaskController => {
		run(executor);

		return {
			cancel: () => {
				isCancelled = true;
				runningTasks = [];
			},
			resume: () => {
				isPaused = false;
				resolvePause();
			},
			pause: () => {
				isPaused = true;
			}
		};
	};
}