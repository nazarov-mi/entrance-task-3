
<script>
	import cDropdown from '@/components/general/dropdown'
	import cScroll from '@/components/general/scroll'
	import cInput from '@/components/general/input'
	import cIcon from '@/components/general/icon'

	export default {
		name: 'cr-users-select',

		components: {
			cDropdown,
			cScroll,
			cInput,
			cIcon
		},

		model: {
			event: 'change',
			prop: 'value'
		},

		props: {
			value: Array,
			options: Array
		},

		data() {
			return {
				mValue: null,
				filterKey: null,
				showIcon: false
			}
		},

		watch: {
			value: 'setValue'
		},

		created() {
			this.setValue(this.value)
		},

		mounted() {
			this.dropdown = this.$refs.dropdown
		},

		beforeDestroy() {
			this.dropdown = null
		},

		computed: {
			filteredOptions() {
				let filterKey = this.filterKey

				if (filterKey == null || filterKey == '') {
					return this.options
				}

				filterKey = filterKey.toLowerCase()

				return this.options.filter(el => (
					el.login
						.toLowerCase()
						.indexOf(filterKey) >= 0
				))
			},
			selected() {
				const value = this.mValue

				if (value.length == 0) {
					return
				}

				return this.options.filter(el => (
					value.indexOf(el.id) >= 0
				))
			}
		},

		methods: {
			setValue(val) {
				val = val || []
				this.mValue = val
				this.$emit('change', val)
			},
			select(val) {
				const index = this.mValue.indexOf(val)

				if (index < 0) {
					this.mValue.push(val)
				} else {
					this.mValue.splice(index, 1)
				}
			},
			handleOptionChange(e) {
				const value = e.currentTarget.attributes['data-value'].nodeValue

				this.select(value)
				this.dropdown.close()
			},
			handleInputFocus(e) {
				this.dropdown.open()
			},
			handleAddonClick(e) {
				this.dropdown.toggle()
			},
			handleDropdownOpen() {
				this.showIcon = true
			},
			handleDropdownClose() {
				this.showIcon = false
			}
		}
	}
</script>

<template>
	<div class="crUsersSelect">
		<c-dropdown
			ref="dropdown"
			prevent
			@open="handleDropdownOpen"
			@close="handleDropdownClose">
			<c-input
				slot="handler"
				placeholder="Например, Тор Одинович"
				v-model="filterKey"
				:show-icon="showIcon"
				@focus="handleInputFocus"
				@addon-click="handleAddonClick">
				<div class="crUsersSelect-icon" slot="icon">
					<c-icon id="asset_icon_arrow"></c-icon>
				</div>
			</c-input>
			<c-scroll
				slot="content"
				:max-height="136">
				<ul class="crUsersSelect-list">
					<li
						class="crUsersSelect-item"
						v-for="item in filteredOptions"
						:data-value="item.id"
						@click="handleOptionChange">
						<div class="crUsersSelect-avatar">
							<img :src="item.avatar" :alt="item.login">
						</div>
						<div class="crUsersSelect-name">
							{{ item.login }} ·
							<span>
								{{ item.floor }} этаж
							</span>
						</div>
					</li>
				</ul>
			</c-scroll>
		</c-dropdown>
		<ul class="crUsersSelect-selected" v-if="selected">
			<li v-for="item in selected">
				<div class="crUsersSelect-avatar">
					<img :src="item.avatar" :alt="item.login">
				</div>
				<div class="crUsersSelect-name">
					{{ item.login }}
				</div>
				<div
					class="crUsersSelect-remove"
					:data-value="item.id"
					@click="handleOptionChange">
					<c-icon id="asset_icon_close"></c-icon>
				</div>
			</li>
		</ul>
	</div>
</template>