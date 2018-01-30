
<script>
	import cRoundedButton from '@/components/general/rounded-button'
	import { mapGetters } from 'vuex'

	export default {
		name: 'cr-event-tooltip',

		components: {
			cRoundedButton
		},

		data() {
			return {
				isActive: false,
				x: 0,
				y: 0,
				left: 0,
				top: 0,

				event: null,
				user: null,
				room: null
			}
		},

		mounted() {
			document.addEventListener('click', this.handleOutClick)
			document.body.appendChild(this.$el)
		},

		beforeDestroy() {
			document.removeEventListener('click', this.handleOutClick)
			document.body.removeChild(this.$el)
		},

		computed: {
			...mapGetters([
				'getUserById',
				'getRoomById',
				'getEventById'
			]),

			styles() {
				return {
					visibility: this.isActive ? 'unset' : 'hidden',
					top: this.top + 'px',
					left: this.left + 'px'
				}
			},
			arrowStyles() {
				return {
					left: (this.x - this.left) + 'px'
				}
			}
		},

		methods: {
			open(x, y, id) {
				const screenWidth = document.documentElement.clientWidth
				const width = this.$el.offsetWidth

				this.x = x
				this.y = y
				this.left = Math.min(Math.max(x - width * .5, 0), screenWidth - width)
				this.top = y

				this.$nextTick(() => {
					this.isActive = true
				})

				const event = this.getEventById(id)
				this.event = event
				this.room = this.getRoomById(event.room)
				this.user = this.getUserById(event.members[0])
			},
			close() {
				this.isActive = false
			},
			updateEvent(id) {
				this.$router.push({
					name: 'event.edit',
					params: {
						id
					}
				})
			},
			handleOutClick(e) {
				this.close()
			}
		}
	}
</script>

<template>
	<div class="crEventTooltip"
		:style="styles"
		@click.stop>
		<div class="crEventTooltip-arrow" :style="arrowStyles"></div>
		<div class="crEventTooltip-content" v-if="event && room && user">
			<div class="crEventTooltip-edit" @click="updateEvent(event.id)">
				<c-rounded-button icon="asset_icon_edit"></c-rounded-button>
			</div>
			<h4>{{ event.title }}</h4>
			<p>
				{{ event.date.start | date('D Ml, T') }}—
				{{ event.date.end | date('T') }} ·
				{{ room.title }}
			</p>
			<div class="crEventTooltip-users">
				<div class="crEventTooltip-avatar">
					<img :src="user.avatar">
				</div>
				<div class="crEventTooltip-name">
					{{ user.login }}
					<span v-if="event.members.length > 1">и {{ event.members.length - 1 }} участников</span>
				</div>
			</div>
		</div>
	</div>
</template>