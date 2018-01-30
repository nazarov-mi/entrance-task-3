
<script>
	import { parseDate } from '@/utils/date'
	import { mapState, mapGetters } from 'vuex'

	export default {
		name: 'cr-events-timeline',

		model: {
			event: 'change',
			prop: 'value'
		},

		props: {
			scroll: Number
		},

		watch: {
			scroll: 'setScroll'
		},

		mounted() {
			this.setScroll(this.scroll)
		},

		computed: {
			...mapState([
				'startOfDay',
				'endOfDay',
				'currentDate'
			]),
			...mapGetters([
				'start',
				'end',
				'duration',
				'isShowingCurrentDay'
			]),

			list() {
				const passedHours = parseDate(this.currentDate).getHours()
				const isShowingCurrentDay = this.isShowingCurrentDay
				const from = this.startOfDay
				const to = this.endOfDay
				const res = []
				let label

				for (let hour = from; hour <= to; ++ hour) {
					label = hour

					if (hour == from || hour == to) {
						label += ':00'
					}

					res.push({
						label: label,
						value: hour,
						passed: isShowingCurrentDay && hour <= passedHours
					})
				}

				return res
			},

			currentStyle() {
				const percent = (this.currentDate - this.start) / this.duration

				return {
					left: (percent * 100) + '%'
				}
			}
		},

		methods: {
			setScroll(val) {
				const el = this.$el

				if (el) {
					el.scrollLeft = val
				}
			}
		}
	}
</script>

<template>
	<div class="eventsTimeline">
		<div class="eventsTimeline-wrapper">
			<div class="eventsTimeline-current" v-if="isShowingCurrentDay" :style="currentStyle">
				<div class="eventsTimeline-currentTime">
					{{ currentDate | date('T') }}
				</div>
			</div>
			<div
				class="eventsTimeline-time"
				v-for="item in list"
				:class="{ 'eventsTimeline-time--passed': item.passed }">
				{{ item.label }}
			</div>
		</div>
	</div>
</template>