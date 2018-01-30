
import axios from 'axios'
import { API_URL } from '@/config'

const http = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json'
	}
})

const createEvent = (input, usersIds, roomId) => {
	return http.post('/', {
		query: `
			mutation ($input: EventInput!, $usersIds: [ID]!, $roomId: ID!) {
				createEvent(input: $input, usersIds: $usersIds, roomId: $roomId) {
					id,
					title,
					dateStart,
					dateEnd,
					users {
						id
					},
					room {
						id
					}
				}
			}
		`,
		variables: {
			input,
			usersIds,
			roomId
		}
	})
		.then(r => r.data.data.createEvent)
}

const updateEvent = (id, input, usersIds, roomId) => {
	return http.post('/', {
		query: `
			mutation ($id: ID!, $input: EventInput!, $usersIds: [ID], $roomId: ID) {
				updateEvent(id: $id, input: $input, usersIds: $usersIds, roomId: $roomId) {
					id,
					title,
					dateStart,
					dateEnd,
					users {
						id
					},
					room {
						id
					}
				}
			}
		`,
		variables: {
			id,
			input,
			usersIds,
			roomId
		}
	})
		.then(r => r.data.data.updateEvent)
}

export const fetchAll = (date) => {
	return http.post('/', {
		query: `
			{
				events {
					id,
					title,
					dateStart,
					dateEnd,
					users {
						id
					},
					room {
						id
					}
				},
				rooms {
					id,
					title,
					capacity,
					floor
				},
				users {
					id,
					login,
					homeFloor,
					avatarUrl
				}
			}
		`
	})
		.then(r => r.data.data)
}

export const saveEvent = (data, swap) => {
	const usersIds = data.members
	const roomId = data.room
	const date = data.date
	const id = data.id
	const input = {
		title: data.title,
		dateStart: date.start,
		dateEnd: date.end
	}

	let promise

	if (swap) {
		promise = Promise.all(swap.map(el => changeEventRoom(el.event, el.room)))
	} else {
		promise = Promise.resolve()
	}

	return promise
		.then(() => {
			return id == null
				? createEvent(input, usersIds, roomId)
				: updateEvent(id, input, usersIds, roomId)
		})
}

export const changeEventRoom = (id, roomId) => {
	return http.post('/', {
		query: `
			mutation ($id: ID!, $roomId: ID!) {
				changeEventRoom(id: $id, roomId: $roomId) {
					room {
						id
					}
				}
			}
		`,
		variables: {
			id,
			roomId
		}
	})
		.then(r => r.data.data.changeEventRoom)
}

export const removeEvent = (id) => {
	return http.post('/', {
		query: `
			mutation ($id: ID!) {
				removeEvent(id: $id) {
					id
				}
			}
		`,
		variables: {
			id
		}
	})
		.then(r => r.data.data.removeEvent)
}