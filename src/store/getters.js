
const HALF_OF_HOUR = 1000 * 60 * 30

export const start = (state) => {
	const date = new Date(state.showingDate)
	date.setHours(state.startOfDay, -30, 0, 0)

	return date.valueOf()
}

export const end = (state) => {
	const date = new Date(state.showingDate)
	date.setHours(state.endOfDay, 30, 0, 0)

	return date.valueOf()
}

export const duration = (state, getters) => {
	return getters.end - getters.start
}

export const isShowingCurrentDay = (state, getters) => {
	return (
		state.currentDate >= getters.start &&
		state.currentDate <= getters.end
	)
}

export const roomsGroupedByFloor = (state) => {
	return state.rooms.reduce((acc, el) => {
		if (acc[el.floor]) {
			acc[el.floor].push(el)
		} else {
			acc[el.floor] = [el]
		}

		return acc
	}, {})
}

export const getEventsByRoomId = (state, getters) => (roomId) => {
	return state.events.filter(el => (
		el.room === roomId &&
		el.date.start < getters.end &&
		el.date.end > getters.start
	))
}

export const getEmptySlotsByRoomId = (state, getters) => (roomId) => {
	const events = getters.getEventsByRoomId(roomId)
	const slots = []
	const end = getters.end - HALF_OF_HOUR
	let start = Math.max(getters.start + HALF_OF_HOUR, state.currentDate)

	events
		.sort((a, b) => (a.date.start - b.date.start))
		.forEach(({ date }) => {
			if (date.start >= end || date.end <= start) {
				return
			}

			if (start < date.start) {
				slots.push({
					start: start,
					end: date.start
				})
			}

			start = Math.min(date.end, end)
		})

	if (start < end) {
		slots.push({
			start,
			end
		})
	}

	return slots
}

export const getEventById = (state, getters) => (id, users, room) => {
	const events = state.events.filter(el => (el.id === id))
	const event = events[0]
	
	if (!event) {
		return null
	}

	if (users && (event.members instanceof Array)) {
		event.members = state.users.filter(el => (event.members.indexOf(el.id) >= 0))
	}

	if (room) {
		event.room = getters.getRoomById(event.room)
	}

	return event
}

export const getRoomById = (state) => (id) => {
	const rooms = state.rooms.filter(el => (el.id === id))

	return rooms[0]
}

export const getUserById = (state) => (id) => {
	const users = state.users.filter(el => (el.id === id))

	return users[0]
}