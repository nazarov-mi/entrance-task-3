
<script>
	export default {
		name: 'c-dropdown',

		props: {
			prevent: Boolean
		},

		data() {
			return {
				isActive: false,
				contentBounding: {
					top: 0,
					left: 0
				}
			}
		},

		created() {
			document.addEventListener('click', this.handleOutClick)
		},

		beforeDestroy() {
			document.removeEventListener('click', this.handleOutClick)
		},

		computed: {
			classes() {
				return {
					'cDropdown--active': this.isActive
				}
			},
			contentStyles() {
				const contentBounding = this.contentBounding

				return {
					'min-width': contentBounding.width + 'px',
					top: contentBounding.top + 'px',
					left: contentBounding.left + 'px'
				}
			}
		},

		methods: {
			open() {
				const bounding = this.$el.getBoundingClientRect()
				const contentBounding = this.contentBounding

				contentBounding.width = bounding.width
				contentBounding.top = bounding.top + bounding.height
				contentBounding.left = bounding.left

				this.isActive = true
				this.$emit('open')
			},
			close() {
				this.isActive = false
				this.$emit('close')
			},
			toggle() {
				if (this.isActive) {
					this.close()
				} else {
					this.open()
				}
			},
			handleHandlerClick(e) {
				if (!this.prevent) {
					this.toggle()
				}
			},
			handleOutClick(e) {
				const el = this.$el
				let target = e.target

				while (target) {
					if (target === el) {
						return
					}
					target = target.parentElement
				}

				this.close()
			}
		}
	}
</script>

<template>
	<div
		class="cDropdown"
		:class="classes">
		<div class="cDropdown-handler" @click="handleHandlerClick">
			<slot name="handler"></slot>
		</div>
		<div class="cDropdown-content" :style="contentStyles">
			<slot name="content"></slot>
		</div>
	</div>
</template>