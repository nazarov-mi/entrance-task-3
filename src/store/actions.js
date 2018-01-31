
import * as api from '@/api'
import * as TYPES from './types'

export const setFetching = ({ commit }, isFetching) => {
	commit(TYPES.SET_FETCHING, isFetching)
}

export const addMessage = ({ commit }, args) => {
	commit(TYPES.MAIN_ADD_MESSAGE, args)
}

export const resetMessages = ({ commit }) => {
	commit(TYPES.MAIN_RESET_MESSAGES)
}

export const setCurrentDate = ({ commit }, date) => {
	commit(TYPES.SET_CURRENT_DATE, date)
}

export const setShowingDate = ({ commit }, date) => {
	commit(TYPES.SET_SHOWING_DATE, date)
}

export const fetchAll = ({ commit }) => {
	commit(TYPES.SET_FETCHING, true)
	return api.fetchAll()
		.then(data => {
			commit(TYPES.SET_FETCHING, false)
			commit(TYPES.SET_DATA, data)
		})
}

export const saveEvent = ({ commit, getters }, { data, swap }) => {
	return api.saveEvent(data, swap)
		.then(rdata => {
			swap && swap.forEach(el => {
				const event = getters.getEventById(el.event)
				commit(TYPES.CHANGE_EVENT_ROOM, {
					event,
					room: el.room
				})
			})
			console.log(rdata)
			commit(TYPES.SET_EVENT, rdata)
			return rdata.id
		})
}

export const removeEvent = ({ commit }, id) => {
	return api.removeEvent(id)
		.then(() => {
			commit(TYPES.REMOVE_EVENT, id)
		})
}