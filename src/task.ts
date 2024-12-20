import { withResolvers } from "./with";

export type Actuator<T, R> = (ctx: T, index: number) => R | Promise<R>

class Task<T, R> {
	list: T[];
	current: T | null = null
	currentIndex: number = 0
	private actuator: Actuator<T, R> | null = null
	private isCancel: boolean = false
	private isPause: boolean = false
	private success: number[] = []
	private failure: number[] = []
	private results: R[] = []
	private continuePromise: PromiseWithResolvers<void> | null = null
	private completePromise: PromiseWithResolvers<{ success: number[], failure: number[], results: R[] }>
	private interruptedPromise: PromiseWithResolvers<void> | null = null

	constructor(list: T[]) {
		this.list = list;
		this.completePromise = withResolvers()
	}

	pause() {
		this.isPause = true
		this.continuePromise = withResolvers()
		this.interruptedPromise = withResolvers()
	}

	resume() {
		if (!this.isPause) {
			return
		}
		this.isPause = false

		const _run = () => this.run(this.actuator!)

		if (this.continuePromise) {
			this.continuePromise.promise.then(_run)
			this.continuePromise.resolve()
			this.continuePromise = null
		} else {
			_run()
		}

		this.interruptedPromise?.resolve()
	}

	cancel() {
		this.isCancel = true
		this.resume()
	}

	async waitComplete() {
		return await this.completePromise.promise
	}

	async waitResume() {
		return await this.interruptedPromise?.promise
	}

	async run(actuator: Actuator<T, R>): Promise<void> {
		this.actuator = actuator
		let current = undefined
		while (!this.isCancel && !this.isPause) {
			current = this.list[this.currentIndex]
			this.current = current

			this.currentIndex++

			if (this.currentIndex > this.list.length) {
				break
			}

			try {
				const result = await Promise.resolve(actuator(current, this.currentIndex))
				this.results.push(result)
				this.success.push(this.currentIndex)
			} catch {
				this.failure.push(this.currentIndex)
			}
		}

		if (!this.isPause) {
			this.completePromise.resolve({
				success: this.success,
				failure: this.failure,
				results: this.results
			})
		}
	}
}

export function createTask<T, R>(list: T[]) {
	return new Task<T, R>(list)
}