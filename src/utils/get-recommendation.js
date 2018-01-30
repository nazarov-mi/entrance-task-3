
/**
 * @typedef {Object} Person
 * @property {String} login Идентификатор сотрудника.
 * @property {Number} floor "Домашний" этаж сотрудника.
 * @property {String} avatar Ссылка на аватар.
 */

/**
 * @typedef {Object} Room
 * @property {Number} id Идентификатор переговорки.
 * @property {String} title Название переговорки.
 * @property {Number} capacity Вместимость (количество человек).
 * @property {Number} floor Этаж, на котором расположена переговорка.
 */

/**
 * @typedef {Object} EventDate
 * @property {Number} start Timestamp начала встречи.
 * @property {Number} end Timestamp окончания встречи.
 */

/**
 * @typedef {Object} Event
 * @property {String} id Идентификатор встречи.
 * @property {String} title Название встречи.
 * @property {String[]} members Логины участников встречи.
 * @property {EventDate} date Дата и время проведения встречи.
 * @property {Number} room Идентификатор переговорки.
 */

/**
 * @typedef {Object} RoomsSwap
 * @property {string} event Идентификатор встречи.
 * @property {String} room Новый идентификатор переговорки.
 */ 

/**
 * @typedef {Object} Recommendation
 * @property {EventDate} date Дата и время проведения встречи.
 * @property {String} room Идентификатор переговорки.
 * @property {RoomsSwap[]} [swap] Необходимые замены переговорк для реализации рекомендации.
 */

/**
 * @param {EventDate} date Дата планируемой встречи.
 * @param {Person[]} members Участники планируемой встречи.
 * @param {Object} db 
 * @param {Event[]} db.events Список все встреч.
 * @param {Room[]} db.rooms Список всех переговорок.
 * @returns {Recommendation[]}
 */
export default function getRecommendation(date, members, db) {

	function getFloorIndex(floor, members) {
		return members.reduce((acc, member) => {
			return acc + Math.abs(member.floor - floor)
		}, 0)
	}

	/**
	 * Возвращает список переговорок с необходимой вместимостью
	 * @param {Number} capacity Необходимая вместимость
	 * @param {Room[]} rooms Список переговорок
	 * @return {Room[]}
	 */
	function getRoomsWithSuitableCapacity(capacity, rooms) {
		return rooms.filter(room => (room.capacity >= capacity))
	}

	/**
	 * Возвращает список событий для конкретной переговорки за заданный промежуток времени
	 * @param {String} room Идентификатор переговорки
	 * @param {EventDate} date Дата события
	 * @param {Event[]} events Список всех событий
	 */
	function getRoomEvents(room, date, events) {
		return events
			.filter(event => (
				event.room == room &&
				event.date.end > date.start &&
				event.date.start < date.end
			))
	}

	function getRecommendation(date, members, db) {
		return getRoomsWithSuitableCapacity(members.length, db.rooms)
			.filter(room => {
				let roomEvents = getRoomEvents(room.id, date, db.events)

				return roomEvents.length === 0
			})
			.map(room => ({
				room: room.id,
				index: getFloorIndex(room.floor, members)
			}))
	}

	function getEventRecommendation(event, db) {
		const events = db.events.filter(el => el.id !== event.id)
		const rooms = db.rooms.filter(el => el.id !== event.room)

		return getRecommendation(
			event.date,
			event.members,
			{
				events,
				rooms: getRoomsWithSuitableCapacity(event.members.length, rooms)
			}
		)
	}

	function getRecommendationWithSwap(date, members, db) {
		const res = []

		getRoomsWithSuitableCapacity(members.length, db.rooms)
			.forEach(room => {
				const roomEvents = getRoomEvents(room.id, date, db.events)
				let i = roomEvents.length
				let swap = []
				let index = 0

				while (--i >= 0) {
					const event = roomEvents[i]
					const eventRecommendation = getEventRecommendation(event, db)
						.sort((a, b) => (a.index - b.index))

					if (eventRecommendation.length === 0) {
						return
					}

					const recomendation = eventRecommendation[0]

					swap.push({
						event: event.id,
						room: recomendation.room
					})

					index += recomendation.index
				}

				index += getFloorIndex(room.floor, members)

				res.push({
					swap,
					room: room.id,
					index
				})
			})

		return res
	}

	function getRecommendationWithChangeDate(date, members, db) {
		const rooms = getRoomsWithSuitableCapacity(members.length, db.rooms)
		const duration = date.end - date.start

		return rooms
			.map(room => {
				const roomEvents = db.events
					.filter(event => (event.room == room.id && event.date.end > date.start))
					.sort(event => (event.date.end - event.date.start))

				let i = roomEvents.length
				let start = date.start
				let end

				while (--i >= 0) {
					const event = roomEvents[i]

					if (event.date.start - start >= duration) {
						break
					}

					start = event.date.end
				}
				
				end = start + duration

				return {
					date: {
						start,
						end
					},
					room: room.id
				}
			})
	}

	let res = getRecommendation(date, members, db)

	if (res.length === 0) {
		res = getRecommendationWithSwap(date, members, db)
	}

	if (res.length > 0) {
		return res
			.sort((a, b) => (a.index - b.index))
			.map(r => {
				delete r.index
				r.date = date
				return r
			})
	}

	return getRecommendationWithChangeDate(date, members, db)
}