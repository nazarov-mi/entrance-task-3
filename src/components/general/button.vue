
<script>
	export default {
		name: 'c-button',
		functional: true,

		props: {
			disabled: Boolean,
			loading: Boolean,
			primary: Boolean,
			label: String,
			href: String,
			class: String,
			tag: {
				type: String,
				default: 'button',
				validator(val) {
					return val === 'button' || val === 'a'
				}
			}
		},

		render(h, context) {
			const props = context.props
			const data = context.data
			const tag = props.tag
			const content = context.children || props.label
			const handleClick = context.listeners.click

			const attributes = {
				class: {
					'cButton': true,
					'cButton--loading': props.loading,
					'cButton--primary': props.primary
				},

				attrs: {
					disabled: props.disabled
				}
			}

			if (data.staticClass) {
				attributes.class[data.staticClass] = true
			}

			if (handleClick) {
				attributes.on = {
					click: (e) => !(props.disabled || props.loading) && handleClick(e)
				}
			}

			if (tag === 'a') {
				attributes.attrs.href = props.href
			}

			return h(tag, attributes, content)
		}
	}
</script>