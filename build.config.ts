import { defineBuildConfig } from 'unbuild'


export default defineBuildConfig({
	entries: [
		'./src/withTimeout.ts'
	],
	rollup: {
		emitCJS: true,
		cjsBridge: true,
	},
	declaration: true,
	clean: true,
	failOnWarn: false
})