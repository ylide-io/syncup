export function asyncDelay(delay: number) {
	return new Promise(resolve => setTimeout(() => resolve(undefined), delay))
}
