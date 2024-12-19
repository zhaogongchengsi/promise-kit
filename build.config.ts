import { defineBuildConfig } from 'unbuild'


export default defineBuildConfig({
	entries: [
		'./src/index.ts',
		'./src/with.ts',
		'./src/array.ts'
	],
	rollup: {
		emitCJS: true,
		cjsBridge: true,
	},
	declaration: true,
	clean: true,
	failOnWarn: false
})