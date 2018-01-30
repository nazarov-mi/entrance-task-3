
<script>
	import cIcon from '@/components/general/icon'
	import dateFilter from '@/utils/date-filter'
	import * as CONSTS from '@/utils/date-const'
	import { parseDate, getWeekday, startOfDay, startOfMonth } from '@/utils//date'

	const sameDates = (a, b) => (
		a.getFullYear() == b.getFullYear() &&
		a.getMonth() == b.getMonth() &&
		a.getDate() == b.getDate()
	)

	export default {
		name: 'c-calendar',

		components: {
			cIcon
		},

		model: {
			event: 'change',
			prop: 'value'
		},

		props: {
			value: [Number, Date],
			month: Number,
			startOfLimit: Number,
			endOfLimit: Number
		},

		data() {
			return {
				mDate: null,
				mMonth: null,
				mStartOfLimit: null,
				mEndOfLimit: null,
				weekdays: CONSTS.SHORT_WEEKDAYS
			}
		},

		watch: {
			value: 'setDate',
			month: 'setMonth',
			startOfLimit: 'setStartOfLimit',
			endOfLimit: 'setEndOfLimit'
		},

		created() {
			this.setDate(this.value, false)
			this.setMonth(this.month)
			this.setStartOfLimit(this.startOfLimit)
			this.setEndOfLimit(this.endOfLimit)
		},

		computed: {
			daysList() {
				const days = []
				const iterator = new Date(this.mMonth)

				iterator.setDate(1)

				const weekday = getWeekday(iterator)

				if (weekday > 1) {
					iterator.setDate(-weekday + 1)
				}

				for (let i = 0; i < 42; ++ i) {
					days.push({
						date: iterator.valueOf(),
						label: iterator.getDate(),
						classes: this.getClassesForDate(iterator)
					})

					iterator.setDate(iterator.getDate() + 1)
				}

				return days
			},
			model() {
				return this.mDate
					? this.mDate.valueOf()
					: null
			}
		},

		methods: {
			setDate(date, setMonth) {
				if (!date) {
					this.mDate = null
					return
				}

				date = parseDate(date)
				this.mDate = startOfDay(date)
				
				if (setMonth !== false) {
					this.setMonth(date.valueOf())
				}
			},

			setMonth(date) {
				date = new Date(date)

				if (!Number.isFinite(date.valueOf())) {
					date = this.model
						? new Date(this.model)
						: new Date()
				}

				this.mMonth = startOfMonth(date)
			},

			setStartOfLimit(date) {
				this.mStartOfLimit = date ? startOfDay(date) : null
			},

			setEndOfLimit(date) {
				this.mEndOfLimit = date ? startOfDay(date) : null
			},

			isWeekendDate(date) {
				return getWeekday(date) > 4
			},

			isTodayDate(date) {
				return sameDates(date, new Date())
			},

			isCurrentDate(date) {
				const current = this.mDate
				return current && sameDates(date, current)
			},

			isOutOfMonth(date) {
				const month = this.mMonth

				return (month && date.getMonth() !== month.getMonth())
			},

			isValidDate(date) {
				if (!date) {
					return false
				}

				if (!(date instanceof Date) || !Number.isFinite(date.valueOf())) {
					return false
				}

				const startOfLimit = this.mStartOfLimit
				const endOfLimit = this.mEndOfLimit

				return !(
					(startOfLimit && startOfLimit > date) ||
					(endOfLimit && endOfLimit < date)
				)
			},

			getClassesForDate(date) {
				const classes = []

				if (this.isTodayDate(date)) {
					classes.push('today')
				}

				if (this.isCurrentDate(date)) {
					classes.push('current')
				}

				if (this.isWeekendDate(date)) {
					classes.push('weekend')
				}

				if (this.isOutOfMonth(date)) {
					classes.push('out')
				}

				if (!this.isValidDate(date)) {
					classes.push('off')
				}

				return classes.map(cl => 'cCalendar-day--' + cl)
			},

			nextMonth() {
				const month = new Date(this.mMonth)
				month.setMonth(month.getMonth() + 1)

				this.setMonth(month)
			},

			prevMonth() {
				const month = new Date(this.mMonth)
				month.setMonth(month.getMonth() - 1)

				this.setMonth(month)
			},

			changeDate(date) {
				this.setDate(date, true)
				this.$emit('change', this.model)
			}
		}
	}
</script>

<template>
	<div class="cCalendar">
		<div class="cCalendar-header">
			<div
				class="cCalendar-arrow cCalendar-arrow--left"
				@click="prevMonth">
				<c-icon id="asset_icon_arrow"></c-icon>
			</div>
			<div class="cCalendar-label">
				{{ mMonth | date('M Y') }}
			</div>
			<div
				class="cCalendar-arrow cCalendar-arrow--right"
				@click="nextMonth">
				<c-icon id="asset_icon_arrow"></c-icon>
			</div>
		</div>
		<div class="cCalendar-body">
			<div
				class="cCalendar-weekday"
				v-for="weekday in weekdays">
				{{ weekday }}
			</div>
			<div
				class="cCalendar-day"
				v-for="day in daysList"
				:class="day.classes"
				@click="changeDate(day.date)">
				{{ day.label }}
			</div>
		</div>
	</div>
</template>