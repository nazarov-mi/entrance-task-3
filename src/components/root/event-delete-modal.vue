
<script>
	import cButton from '@/components/general/button'
	import cModal from '@/components/general/modal'

	export default {
		name: 'cr-event-delete-modal',

		components: {
			cButton,
			cModal
		},

		mounted() {
			this.modal = this.$refs.modal
		},

		beforeDestroy() {
			this.modal = null
		},

		methods: {
			open() {
				this.modal.open()
			},
			handleCancel(e) {
				this.modal.close()
				this.$emit('cancel')
			},
			handleConfirm(e) {
				this.modal.close()
				this.$emit('confirm')
			}
		}
	}
</script>

<template>
	<c-modal ref="modal">
		<img slot="icon" src="static/emoji1.png">
		<h6 slot="title">Встреча будет удалена безвозвратно</h6>
		<template slot="buttons">
			<c-button @click="handleCancel">Отмена</c-button>
			<c-button @click="handleConfirm">Удалить</c-button>
		</template>
	</c-modal>
</template>