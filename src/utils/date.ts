// Chrome 80 shows timestamp "24:xx" instead of "00:00".
// https://stackoverflow.com/questions/60886186/intl-datetimeformat-shows-time-being-2459

const LOCALE = 'en-US'

//

const sameDayFormat = new Intl.DateTimeFormat(LOCALE, {
	hourCycle: 'h23',
	hour: 'numeric',
	minute: 'numeric',
})

const sameYearFormat = new Intl.DateTimeFormat(LOCALE, {
	day: 'numeric',
	month: 'short',
})

const anotherYearFormat = new Intl.DateTimeFormat(LOCALE, {
	day: 'numeric',
	month: 'short',
	year: '2-digit',
})

const longFormat = new Intl.DateTimeFormat(LOCALE, {
	hourCycle: 'h23',
	hour: 'numeric',
	minute: 'numeric',
	day: 'numeric',
	month: 'short',
	year: 'numeric',
})

export enum DateFormatStyle {
	SHORT,
	LONG,
}

export function formatDate(date: Date | number | string, style: DateFormatStyle = DateFormatStyle.SHORT) {
	date = typeof date === 'number' ? new Date(date) : typeof date === 'string' ? new Date(date) : date
	const now = new Date()

	const isSameYear = now.getFullYear() === date.getFullYear()
	const isSameDay = isSameYear && now.getMonth() === date.getMonth() && now.getDate() === date.getDate()

	const format =
		style === DateFormatStyle.LONG
			? longFormat
			: isSameDay
			? sameDayFormat
			: isSameYear
			? sameYearFormat
			: anotherYearFormat

	return format.format(date)
}

//

export function formatDuration(ms: number) {
	if (ms < 0) ms = -ms

	return Object.entries({
		day: Math.floor(ms / 86400000),
		hr: Math.floor(ms / 3600000) % 24,
		min: Math.floor(ms / 60000) % 60,
	})
		.filter(val => val[1] !== 0)
		.map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
		.join(' ')
}
