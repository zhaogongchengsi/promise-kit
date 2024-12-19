export async function forEach<T>(arr: T[], callbackfn: (value: T, index: number, array: T[]) => (void | Promise<void>), thisArg?: any) {
	let i = 0;
	for (const item of arr) {
		await Promise.resolve(callbackfn.call(thisArg, item, i++, arr));
	}
}

export async function map<T, U>(arr: T[], callbackfn: (value: T, index: number, array: T[]) => U | Promise<U>, thisArg?: any): Promise<U[]> {
	let i = 0;
	const result: U[] = [];
	for (const item of arr) {
		result.push(await Promise.resolve(callbackfn.call(thisArg, item, i++, arr)));
	}
	return result;
}