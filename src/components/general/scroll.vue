
<script>
	const MutationObserver = window.MutationObserver || window.WebKitMutationObserver

	export default {
		name: 'c-scroll',

		props: {
			scrollAmount: {
				type: Number,
				default: 20
			},
			minHeight: Number,
			maxHeight: Number
		},

		data() {
			return {
				thumbTop: 0,
				thumbHeight: 1,
				scrollbarWidth: 0
			}
		},

		mounted() {
			const content = this.$refs.content

			this.observer = new MutationObserver(this.updateThumb)
			this.observer.observe(
				this.$refs.content,
				{
					removedNodes: true,
					childList: true,
					subtree: true
				}
			)

			this.scrollbarWidth = content.offsetWidth - content.clientWidth

			this.updateThumb()
		},

		beforeDestroy() {
			this.observer.disconnect()
		},

		computed: {
			styles() {
				return {
					'min-height': this.minHeight + 'px',
					'max-height': this.maxHeight + 'px'
				}
			},
			contentStyles() {
				return {
					'margin-right': -this.scrollbarWidth + 'px'
				}
			},
			thumbStyles() {
				return {
					top: (this.thumbTop * 100) + '%',
					height: (this.thumbHeight * 100) + '%'
				}
			}
		},

		methods: {
			updateThumb() {
				const content = this.$refs.content

				this.thumbTop = content.scrollTop / content.scrollHeight
				this.thumbHeight = content.offsetHeight / content.scrollHeight
			},
			handleScroll(e) {
				this.updateThumb()
			}
		}
	}
</script>

<template>
	<div
		class="cScroll"
		:style="styles">
		<div class="cScroll-wrapper">
			<div
				class="cScroll-content"
				ref="content"
				:style="contentStyles"
				@scroll="handleScroll">
				<slot></slot>
			</div>
		</div>
		<div class="cScroll-bar">
			<div
				class="cScroll-thumb"
				:style="thumbStyles">
			</div>
		</div>
	</div>
</template>