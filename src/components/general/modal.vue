
<script>
	export default {
		name: 'c-modal',

		data() {
			return {
				isActive: false
			}
		},

		mounted() {
			document.body.appendChild(this.$el)
		},

		beforeDestroy() {
			document.body.removeChild(this.$el)
		},

		methods: {
			open() {
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
			}
		}
	}
</script>

<template>
	<div class="cModal" v-show="isActive" @click="close">
		<div class="cModal-content" @click.stop>
			<div class="cModal-icon" v-if="$slots.icon">
				<slot name="icon"></slot>
			</div>
			<div class="cModal-title" v-if="$slots.title">
				<slot name="title"></slot>
			</div>
			<div class="cModal-subtitle" v-if="$slots.subtitle">
				<slot name="subtitle"></slot>
			</div>
			<div class="cModal-buttons" v-if="$slots.buttons">
				<slot name="buttons"></slot>
			</div>
		</div>
	</div>
</template>