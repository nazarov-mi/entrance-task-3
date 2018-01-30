
<script>
	import cDropdown from '@/components/general/dropdown'
	import cCalendar from '@/components/general/calendar'
	import cInput from '@/components/general/input'
	import cIcon from '@/components/general/icon'
	import dateFilter from '@/utils/date-filter'

	export default {
		name: 'c-date',

		components: {
			cDropdown,
			cCalendar,
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
			startOfLimit: Number,
			endOfLimit: Number
		},

		data() {
			return {
				mDate: null
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
			label() {
				const date = this.mDate

				if (date) {
					return dateFilter(date, 'D Mdl, Y')
				}

				return ''
			}
		},

		methods: {
			setDate(date) {
				this.mDate = date
			},
			changeDate(date) {
				this.setDate(date)
				this.$emit('change', this.mDate)
			},
			handleFocus(e) {
				this.dropdown.open()
			},
			handleAddonClick(e) {
				this.dropdown.toggle()
			}
		}
	}
</script>

<template>
	<div class="cDate">
		<c-dropdown ref="dropdown" prevent>
			<c-input
				slot="handler"
				:value="label"
				:disabled="disabled"
				:placeholder="placeholder"
				@focus="handleFocus"
				@addon-click="handleAddonClick">
				<c-icon slot="icon" id="asset_icon_calendar"></c-icon>
			</c-input>
			<c-calendar
				slot="content"
				:start-of-limit="startOfLimit"
				:end-of-limit="endOfLimit"
				:value="mDate"
				@change="changeDate">
			</c-calendar>
		</c-dropdown>
	</div>
</template>