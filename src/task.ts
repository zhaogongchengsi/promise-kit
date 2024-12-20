import { withResolvers } from "./with";

export type Actuator<T> = (ctx: T, index: number) => void

class Task<T> {
	list: T[];
	current: T | null = null
	currentIndex: number = 0
	private actuator: Actuator<T> | null = null

	private isCancel: boolean = false
	private isPause: boolean = false
	private continuePromise: PromiseWithResolvers<void> | null = null
	private completePromise: PromiseWithResolvers<{success: number[], failure: number[]}>
	private success: number[] = []
	private failure: number[] = []

	constructor(list: T[]) {
		this.list = list;
		this.completePromise = withResolvers()
	}

	pause() {
		this.isPause = true
		this.continuePromise = withResolvers()
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
	}

	cancel() {
		this.isCancel = true
		this.resume()
	}

	async waitComplete() {
		return await this.completePromise.promise
	}

	async run(actuator: Actuator<T>): Promise<void> {
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
				await Promise.resolve(actuator(current, this.currentIndex))
				this.success.push(this.currentIndex)
			} catch { 
				this.failure.push(this.currentIndex)
			}
		}

		if (!this.isPause) {
			this.completePromise.resolve({
				success: this.success,
				failure: this.failure
			})
		}
	}
}

export function createTask<T>(list: T[]) {
	return new Task(list)
}