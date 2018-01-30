
import * as CONSTS from './date-const'
import { parseDate, getWeekday } from './date'

let currentFlags = null

const hasFlag = flag => {
	return (currentFlags && currentFlags.indexOf(flag) >= 0)
}

const twoNums = num => {
	return ('0' + num).slice(-2)
}

const filterDay = date => {
	return date.getDate()
}

const filterMonth = date => {
	const index = date.getMonth()
	let month = CONSTS.MONTHS[index]
	
	if (hasFlag('d')) {
		month = CONSTS.DEPENDENT_MONTHS[index]
	} else
	if (hasFlag('s')) {
		month = CONSTS.SHORT_MONTHS[index]
	}

	if (hasFlag('l')) {
		month = month.toLowerCase()
	}

	return month
}

const filterYear = date => {
	return date.getFullYear()
}

const filterWeekday = date => {
	const index = getWeekday(date)
	let weekday = CONSTS.WEEKDAYS[index]

	if (hasFlag('s')) {
		weekday = CONSTS.SHORT_WEEKDAYS[index]
	}

	if (hasFlag('l')) {
		weekday = weekday.toLowerCase()
	}

	return weekday
}

const filterTime = date => {
	let hours = date.getHours()
	let minutes = date.getMinutes()

	return twoNums(hours) + ':' + twoNums(minutes)
}

export default (date, mask) => {
	date = parseDate(date)

	if (typeof mask !== 'string') {
		return date.toISOString()
	}
	
	return mask.replace(/(D|M|Y|W|T)([a-z]+)?/g, el => {
		const key = el.charAt(0)
		const flags = el.slice(1)

		currentFlags = flags

		switch (key) {
			case 'D':
				return filterDay(date)

			case 'M':
				return filterMonth(date)

			case 'Y':
				return filterYear(date)

			case 'W':
				return filterWeekday(date)

			case 'T':
				return filterTime(date)
		}

		return el
	})
}