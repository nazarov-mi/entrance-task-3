
<script>
	import cButton from '@/components/general/button'
	import cModal from '@/components/general/modal'
	import { mapGetters } from 'vuex'

	export default {
		name: 'cr-event-created-modal',

		components: {
			cButton,
			cModal
		},

		data() {
			return {
				event: null
			}
		},

		mounted() {
			this.modal = this.$refs.modal
		},

		beforeDestroy() {
			this.modal = null
		},

		computed: mapGetters([
			'getEventById'
		]),

		methods: {
			open(id) {
				const event = this.getEventById(id, false, true)

				if (event) {
					this.event = event
					this.modal.open()
				}
			},
			handleClose(e) {
				this.modal.close()
			}
		}
	}
</script>

<template>
	<c-modal ref="modal">
		<img slot="icon" src="static/emoji1.png">
		<h6 slot="title">Встреча создана!</h6>
		<template slot="subtitle" v-if="event">
			<p>
				{{ event.date.start | date('D Ml, T') }}—
				{{ event.date.end | date('T') }}
			</p>
			<p v-if="event.room">
				{{ event.room.title }} ·
				{{ event.room.floor }}
			</p>
		</template>
		<template slot="buttons">
			<c-button primary @click="handleClose">Хорошо</c-button>
		</template>
	</c-modal>
</template>