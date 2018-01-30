
<script>
	import cDropdown from '@/components/general/dropdown'
	import cInput from '@/components/general/input'
	import cIcon from '@/components/general/icon'

	const twoNums = val => ('0' + val).slice(-2)

	export default {
		name: 'c-time',

		components: {
			cDropdown,
			cInput,
			cIcon
		},

		model: {
			event: 'change',
			prop: 'value'
		},

		props: {
			value: Number,
			disabled: Boolean,
			placeholder: String,
			minuteStep: {
				type: Number,
				default: 5
			}
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

		computed: {
			hours() {
				const hours = this.date.getHours()
				return twoNums(hours)
			},
			minutes() {
				const minutes = this.date.getMinutes()
				return twoNums(minutes)
			},
			label() {
				return this.hours + ':' + this.minutes
			}
		},

		methods: {
			setDate(val) {
				let date = new Date(val || 0)

				this.date = date
			},
			handleFocus(e) {
				this.$nextTick(_ => this.dropdown.open())
			},
			handleArrowClick(e) {
				const attrs = e.currentTarget.attributes
				const prop = attrs['data-prop'].nodeValue
				const step = parseInt(attrs['data-step'].nodeValue, 10)
				const date = this.date

				if (prop == 'hours') {
					date.setHours(date.getHours() + step)
				} else {
					const minutes = date.getMinutes() + step
					const minuteStep = this.minuteStep
					date.setMinutes(~~(minutes / minuteStep) * minuteStep, 0, 0)
				}

				this.$emit('change', date.valueOf())
			}
		}
	}
</script>

<template>
	<div class="cTime">
		<c-dropdown ref="dropdown" prevent>
			<c-input
				slot="handler"
				:value="label"
				:disabled="disabled"
				:placeholder="placeholder"
				:show-icon="false"
				@focus="handleFocus">
			</c-input>
			<div class="cTime-dropdown" slot="content">
				<div class="cTime-col">
					<div
						class="cTime-arrow cTime-arrow--up"
						data-prop="hours"
						data-step="1"
						@click="handleArrowClick">
						<c-icon id="asset_icon_arrow"></c-icon>
					</div>
					<div class="cTime-label">
						{{ hours }}
					</div>
					<div
						class="cTime-arrow cTime-arrow--down"
						data-prop="hours"
						data-step="-1"
						@click="handleArrowClick">
						<c-icon id="asset_icon_arrow"></c-icon>
					</div>
				</div>
				<div class="cTime-divider"></div>
				<div class="cTime-col">
					<div
						class="cTime-arrow cTime-arrow--up"
						data-prop="minutes"
						data-step="5"
						@click="handleArrowClick">
						<c-icon id="asset_icon_arrow"></c-icon>
					</div>
					<div class="cTime-label">
						{{ minutes }}
					</div>
					<div
						class="cTime-arrow cTime-arrow--down"
						data-prop="minutes"
						data-step="-5"
						@click="handleArrowClick">
						<c-icon id="asset_icon_arrow"></c-icon>
					</div>
				</div>
			</div>
		</c-dropdown>
	</div>
</template>