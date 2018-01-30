
<script>
	export default {
		name: 'c-icon',
		functional: true,

		props: {
			id: {
				type: String,
				required: true
			},
			width: {
				type: [String, Number],
				default: 12
			},
			height: {
				type: [String, Number],
				default: 12
			}
		}
	}
</script>

<template functional>
	<div class="cIcon">
		<svg
			xmlns:xlink="http://www.w3.org/1999/xlink"
			:width="`${props.width}px`"
			:height="`${props.height}px`">
			<use v-bind="{ 'xlink:href': `#${props.id}` }"/>
		</svg>
	</div>
</template>