
<script>
	import cRoundedButton from '@/components/general/rounded-button'
	import cDropdown from '@/components/general/dropdown'
	import cCalendar from '@/components/general/calendar'
	import { parseDate, startOfDay } from '@/utils/date'

	export default {
		name: 'cr-events-date',

		components: {
			cRoundedButton,
			cDropdown,
			cCalendar
		},

		model: {
			event: 'change',
			prop: 'value'
		},

		data() {
			return {
				date: null
			}
		},

		watch: {
			value: 'setDate'
		},

		created() {
			this.setDate(this.value)
		},

		mounted() {
			this.dropdown = this.$refs.dropdown
		},

		beforeDestroy() {
			this.dropdown = null
		},

		methods: {
			setDate(date) {
				date = parseDate(date)
				date = startOfDay(date)
				this.date = date
			},
			nextDay() {
				const date = new Date(this.date)
				date.setDate(date.getDate() + 1)
				this.changeDate(date)
			},
			prevDay() {
				const date = new Date(this.date)
				date.setDate(date.getDate() - 1)
				this.changeDate(date)
			},
			changeDate(date) {
				this.dropdown.close()
				this.setDate(date)
				this.$emit('change', this.date.valueOf())
			}
		}
	}
</script>

<template>
	<div class="eventsDate">
		<c-dropdown ref="dropdown">
			<div class="eventsDate-handler" slot="handler">
				<div class="eventsDate-arrow eventsDate-arrow--left" @click.stop="prevDay">
					<c-rounded-button icon="asset_icon_arrow"></c-rounded-button>
				</div>
				<div class="eventsDate-label">
					{{ date | date('D Ms · Ws') }}
				</div>
				<div class="eventsDate-arrow eventsDate-arrow--right" @click.stop="nextDay">
					<c-rounded-button icon="asset_icon_arrow"></c-rounded-button>
				</div>
			</div>
			<div class="eventsDate-content" slot="content">
				<c-calendar
					:value="date"
					@change="changeDate">
				</c-calendar>
			</div>
		</c-dropdown>
	</div>
</template>