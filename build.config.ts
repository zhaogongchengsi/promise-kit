import { defineBuildConfig } from 'unbuild'


export default defineBuildConfig({
	entries: [
		'./src/index.ts',
		'./src/with.ts',
		'./src/array.ts',
		'./src/sleep.ts',
		'./src/task.ts',
	],
	rollup: {
		emitCJS: true,
		cjsBridge: true,
	},
	declaration: true,
	clean: true,
	failOnWarn: false
})