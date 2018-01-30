
export const MONTHS = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь'
]

export const DEPENDENT_MONTHS = MONTHS.map(month => {
	const last = month.charAt(month.length - 1)

	if (last == 'ь' || last == 'й') {
		return month.slice(0, -1) + 'я'
	}
	
	return month + 'а'
})

export const SHORT_MONTHS = MONTHS.map(month => month.slice(0, 3))

export const WEEKDAYS = [
	'Понедельник',
	'Вторник',
	'Среда',
	'Четверг',
	'Пятница',
	'Суббота',
	'Воскресенье'
]

export const SHORT_WEEKDAYS = [
	'Пн',
	'Вт',
	'Ср',
	'Чт',
	'Пт',
	'Сб',
	'Вс'
]