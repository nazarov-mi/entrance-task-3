
export const parseDate = val => {
	const date = new Date(val)

	if (!isFinite(date.valueOf())) {
		return new Date()
	}

	return date
}

export const getWeekday = date => {
	return (date.getDay() || 7) - 1
}

export const startOfMonth = date => {
	date.setDate(1)
	date.setHours(0, 0, 0, 0)

	return date
}

export const startOfDay = date => {
	date.setHours(0, 0, 0, 0)

	return date
}

export const startOfHour = date => {
	date.setMinutes(0, 0, 0)

	return date
}

export const startOfMinutes = date => {
	date.setSeconds(0, 0)

	return date
}