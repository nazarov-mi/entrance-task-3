
<script>
	import cIcon from '@/components/general/icon'

	export default {
		name: 'c-input',

		components: {
			cIcon
		},

		model: {
			event: 'input',
			prop: 'value'
		},

		props: {
			value: [String, Number],
			disabled: Boolean,
			placeholder: String,
			type: {
				type: String,
				default: 'text'
			},
			showIcon: {
				type: Boolean,
				default: true
			}
		},

		data() {
			return {
				mValue: this.value
			}
		},

		watch: {
			value(val) {
				this.mValue = val
				this.$emit('change', val)
			}
		},

		computed: {
			isNotEmpty() {
				return (this.mValue !== '' && this.mValue !== undefined)
			},
			hasIcon() {
				return !!this.$slots.icon
			}
		},

		methods: {
			handleInput(e) {
				const val = e.target.value

				this.mValue = val
				this.$emit('input', val)
			},
			handleChange(e) {
				const val = e.target.value

				this.mValue = val
				this.$emit('change', val)
			},
			handleFocus(e) {
				this.$emit('focus', e)
			},
			handleBlur(e) {
				this.$emit('blur', e)
			},
			handleClear(e) {
				this.$emit('input', '')
				this.$emit('change', '')
				this.$emit('clear')
			},
			handleAddonClick(e) {
				this.$emit('addon-click', e)
			}
		}
	}
</script>

<template>
	<div class="cInput">
		<input
			class="cInput-input"
			:type="type"
			:value="mValue"
			:placeholder="placeholder"
			@input="handleInput"
			@change="handleChange"
			@focus="handleFocus"
			@blur="handleBlur">
		<div
			class="cInput-addon"
			v-if="showIcon && !hasIcon && isNotEmpty"
			@click="handleClear">
			<c-icon id="asset_icon_close"></c-icon>
		</div>
		<div
			class="cInput-addon"
			v-if="showIcon && hasIcon"
			@click="handleAddonClick">
			<slot name="icon"></slot>
		</div>
	</div>
</template>