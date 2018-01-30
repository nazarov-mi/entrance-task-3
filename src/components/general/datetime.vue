
<script>
	import cDate from '@/components/general/date'
	import cTime from '@/components/general/time'

	export default {
		name: 'c-datetime',

		components: {
			cDate,
			cTime
		},

		model: {
			event: 'change',
			prop: 'value'
		},

		props: {
			value: Object
		},

		data() {
			return {
				date: null,
				fromTime: null,
				toTime: null
			}
		},

		watch: {
			value: 'setDate'
		},

		created() {
			this.setDate(this.value)
		},

		computed: {
			start() {
				const date = new Date(this.date)
				const time = new Date(this.fromTime)

				date.setHours(time.getHours(), time.getMinutes(), 0, 0)

				return date.valueOf()
			},
			end() {
				const date = new Date(this.date)
				const time = new Date(this.toTime)

				date.setHours(time.getHours(), time.getMinutes(), 0, 0)

				return date.valueOf()
			}
		},

		methods: {
			setDate(val) {
				if (!val) {
					return
				}

				const now = (new Date()).valueOf()

				this.date = val.start || val.end || now
				this.fromTime = val.start || now
				this.toTime = val.end || now
			},
			handleChange() {
				let value = this.value

				if (
					!(value instanceof Object) ||
					!Number.isFinite(value.start) ||
					!Number.isFinite(value.end)
				) {
					value = {}
				}

				value.start = this.start
				value.end = this.end

				this.$emit('change', value)
			}
		}
	}
</script>

<template>
	<div class="cDatetime">
		<div class="cDatetime-date">
			<div class="control">
				<label class="control-label hide-on-touch">Дата</label>
				<label class="control-label show-on-touch">Дата и время</label>
				<c-date v-model="date" @change="handleChange"></c-date>
			</div>
		</div>
		<div class="cDatetime-times">
			<div class="cDatetime-time">
				<div class="control">
					<label class="control-label hide-on-touch">Начало</label>
					<c-time v-model="fromTime" @change="handleChange"></c-time>
				</div>
			</div>
			<div class="cDatetime-divider"></div>
			<div class="cDatetime-time">
				<div class="control">
					<label class="control-label hide-on-touch">Конец</label>
					<c-time v-model="toTime" @change="handleChange"></c-time>
				</div>
			</div>
		</div>
	</div>
</template>