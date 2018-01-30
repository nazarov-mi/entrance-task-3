
<script>
	import cButton from '@/components/general/button'
	import cIcon from '@/components/general/icon'

	export default {
		name: 'cr-header',

		components: {
			cButton,
			cIcon
		},

		computed: {
			showButton() {
				const name = this.$route.name
				return name.indexOf('event') !== 0
			}
		}
	}
</script>

<template>
	<div class="crHeader">
		<router-link class="logotype" :to="{ name: 'main' }">
			<c-icon id="asset_logo" width="175" height="26"/>
		</router-link>
		<router-link
			class="hide-on-touch"
			v-if="showButton"
			:to="{ name: 'event.create' }">
			<c-button primary>Создать встречу</c-button>
		</router-link>
	</div>
</template>