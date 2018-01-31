
import { parseDate } from '@/utils/date'
import * as TYPES from './types'

const parseEvent = (event) => Object.freeze({
	id: event.id,
	title: event.title,
	date: {
		start: (new Date(event.dateStart)).valueOf(),
		end: (new Date(event.dateEnd)).valueOf()
	},
	room: event.room && event.room.id,
	members: event.users && event.users.map(user => user.id)
})

const parseUser = (el) => Object.freeze({
	id: el.id,
	login: el.login,
	floor: el.homeFloor,
	avatar: el.avatarUrl
})

export default {
	[TYPES.SET_FETCHING] (state, isFetching) {
		state.isFetching = isFetching
	},
	[TYPES.MAIN_ADD_MESSAGE] (state, args) {
		state.messages.push({
			message: args.message,
			type: args.type
		})
	},
	[TYPES.MAIN_RESET_MESSAGES] (state) {
		state.messages = [];
	},

	[TYPES.SET_CURRENT_DATE] (state, date) {
		state.currentDate = parseDate(date).valueOf()
	},
	[TYPES.SET_SHOWING_DATE] (state, date) {
		state.showingDate = parseDate(date).valueOf()
	},

	[TYPES.SET_DATA] (state, data) {
		state.rooms = data.rooms || []

		if (data.events) {
			state.events = data.events.map(el => parseEvent(el))
		}

		if (data.users) {
			state.users = data.users.map(el => parseUser(el))
		}
	},
	[TYPES.SET_EVENT] (state, data) {
		const event = parseEvent(data)
		const events = state.events
		let i = events.length
		let id = i

		while (--i >= 0) {
			if (events[i].id === event.id) {
				id = i
				break
			}
		}

		events[id] = event
	},
	[TYPES.REMOVE_EVENT] (state, id) {
		state.events = state.events
			.filter(event => (event.id !== id))
	},
	[TYPES.CHANGE_EVENT_ROOM] (state, { event, room }) {
		if (event) {
			event.room = room
		}
	}
}