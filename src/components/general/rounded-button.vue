
<script>
	import cIcon from '@/components/general/icon'

	export default {
		name: 'c-rounded-button',
		function: true,

		components: {
			cIcon
		},

		props: {
			disabled: Boolean,
			icon: {
				type: String,
				required: true
			}
		}
	}
</script>

<template>
	<button class="cRoundedButton">
		<c-icon width="11" height="11" :id="icon"></c-icon>
	</button>
</template>