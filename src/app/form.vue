
<script>
	import crRecommendationSelect from '@/components/root/recommendation-select'
	import crEventDeleteModal from '@/components/root/event-delete-modal'
	import crUsersSelect from '@/components/root/users-select'
	import cRoundedButton from '@/components/general/rounded-button'
	import cDatetime from '@/components/general/datetime'
	import cButton from '@/components/general/button'
	import cInput from '@/components/general/input'
	import Form from '@/utils/form'
	import getRecommendation from '@/utils/get-recommendation'
	import { mapActions, mapState, mapGetters } from 'vuex'

	export default {
		name: 'form-page',

		components: {
			crRecommendationSelect,
			crEventDeleteModal,
			crUsersSelect,
			cRoundedButton,
			cDatetime,
			cButton,
			cInput
		},

		props: {
			date: Object,
			room: String
		},

		data() {
			return {
				inProcessing: false,
				swap: null,
				form: new Form(
					[
						'id',
						'title',
						'date',
						'members',
						'room'
					],
					{
						title(value) {
							if (value == null || value == '') {
								return 'Укажите тему'
							}
						},
						date(value) {
							if (
								!(value instanceof Object) ||
								!Number.isFinite(value.start) ||
								!Number.isFinite(value.end)
							) {
								return 'Укажите дату и время'
							}

							if (value.start >= value.end) {
								return 'Дата начала должна быть раньше даты окончания'
							}
						},
						members(value) {
							if (
								!(value instanceof Array) ||
								value.length === 0
							) {
								return 'Выберите участников'
							}
						},
						// Стрелочная функция для сохранения контекста
						room: (value, values) => {
							if (!value) {
								return 'Выберите переговорку'
							}

							const room = this.getRoomById(value)
							const members = values.members

							if (members instanceof Array && members.length > room.capacity) {
								return 'Выбранная переговорка слишком мала'
							}
						}
					}
				)
			}
		},

		watch: {
			date: 'setDate',
			room: 'setRoom',
			events: 'find',
			'$route': 'find',
			'form.values': {
				deep: true,
				handler() {
					this.form.validate()
				}
			}
		},

		created() {
			this.setDate(this.date)
			this.setRoom(this.room)
			this.find()
		},

		mounted() {
			this.eventDeleteModal = this.$refs.eventDeleteModal
		},

		beforeDestroy() {
			this.eventDeleteModal = null
		},

		computed: {
			...mapGetters([
				'getEventById',
				'getRoomById'
			]),
			...mapState([
				'users',
				'rooms',
				'events'
			]),

			recommendation() {
				const form = this.form
				const { id, date, members } = form.values
				const rooms = this.rooms
				let events = this.events

				if (form.isExist) {
					events = events.filter(el => (el.id !== id))
				}

				if (
					date instanceof Object &&
					Number.isFinite(date.start) &&
					Number.isFinite(date.end) &&
					date.start < date.end &&
					members instanceof Array &&
					members.length > 0
				) {
					return getRecommendation(date, members, {
						events,
						rooms
					})
					.map(el => {
						el.room = this.getRoomById(el.room)
						return el
					})
				}

				return []
			}
		},

		methods: {
			...mapActions([
				'saveEvent',
				'removeEvent'
			]),

			find() {
				const id = this.$route.params.id
				const event = id && this.getEventById(id)

				if (event) {
					this.form.reset()
					this.form.setData(event)
				}
			},
			back() {
				this.$router.push({
					name: 'main'
				})
			},
			save() {
				const isExist = this.form.isExist
				this.saveEvent({
					data: this.form.values,
					swap: this.swap
				})
					.then(id => {
						if (!isExist) {
							this.$root.$emit('event-created', id)
						}
						this.back()
					})
			},
			remove() {
				if (this.form.isExist) {
					this.eventDeleteModal.open()
				}
			},
			confirmRemove() {
				const id = this.form.values.id
				this.removeEvent(id)
					.then(() => this.back())
			},
			setDate(date) {
				this.form.setData({
					date,
					room: null
				})
			},
			setRoom(room) {
				this.form.setData({
					room
				})
			},
			changeRecommendation(recommendation) {
				this.form.setData({
					room: recommendation && recommendation.room && recommendation.room.id,
				})
				this.swap = recommendation && recommendation.swap

				if (recommendation) {
					this.form.setData({
						date: recommendation.date
					})
				}
			},
			handleDatetimeChange() {
				this.setRoom(null)
			}
		}
	}
</script>

<template>
	<div class="form">
		<cr-event-delete-modal ref="eventDeleteModal" @confirm="confirmRemove"></cr-event-delete-modal>
		<div class="form-header">
			<div class="form-container">
				<h2 class="form-title">
					{{ form.isExist ? 'Редактирование встречи' : 'Новая встреча' }}
					<router-link
						class="form-cancel"
						:to="{ name: 'main' }">
						<c-rounded-button icon="asset_icon_close"></c-rounded-button>
					</router-link>
				</h2>
			</div>
		</div>
		<div class="form-body">
			<div class="form-container">
				<div class="form-row">
					<div class="form-group">
						<div class="form-field">
							<div class="control">
								<label class="control-label">Тема</label>
								<c-input placeholder="О чём будете говорить?" v-model="form.values.title"></c-input>
							</div>
						</div>
						<div class="form-field">
							<c-datetime v-model="form.values.date" @change="handleDatetimeChange"></c-datetime>
						</div>
					</div>
				</div>
				<div class="form-row">
					<div class="form-group">
						<div class="form-field">
							<div class="control">
								<label class="control-label">Участники</label>
								<cr-users-select
									:options="users"
									v-model="form.values.members">
								</cr-users-select>
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="form-field">
							<div class="control">
								<label class="control-label">
									{{ form.values.room ? 'Ваша переговорка' : 'Рекомендованные переговорки' }}
								</label>
								<cr-recommendation-select
									:date="form.values.date"
									:room="form.values.room"
									:recommendation="recommendation"
									@change="changeRecommendation">
								</cr-recommendation-select>
							</div>
						</div>
					</div>
				</div>
				<div
					class="form-row show-on-touch"
					v-if="form.isExist"
					@click="remove">
					<div class="form-group">
						<div class="form-remove">
							Удалить встречу
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="form-notification" v-if="form.firstError">
			<div class="form-notificationWrapper">
				<div class="form-container">
					{{ form.firstError }}
				</div>
			</div>
		</div>
		<div class="form-footer" v-if="form.isExist">
			<div class="form-container">
				<c-button @click="back">
					Отмена
				</c-button>
				<c-button
					class="hide-on-touch"
					:loading="inProcessing"
					@click="remove">
					Удалить встречу
				</c-button>
				<c-button
					primary
					:disabled="!form.isValid"
					:loading="inProcessing"
					@click="save">
					Сохранить
				</c-button>
			</div>
		</div>
		<div class="form-footer" v-else>
			<div class="form-container">
				<c-button
					class="hide-on-touch"
					@click="back">
					Отмена
				</c-button>
				<c-button
					primary
					:disabled="!form.isValid"
					:loading="inProcessing"
					@click="save">
					Создать встречу
				</c-button>
			</div>
		</div>
	</div>
</template>