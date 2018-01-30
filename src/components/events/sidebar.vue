
<script>
	export default {
		name: 'cr-events-sidebar',

		props: {
			scroll: Number,
			selectedRoom: [Number, String],
			list: Object
		},

		computed: {
			isMini() {
				const el = this.$el
				const scroll = this.scroll

				// Необходимо проверять изменения параметра scroll перед проверкой параметра el,
				// тк параметр el не является реактивным и условие не будет отслеживаться
				return (scroll > 0 && el && el.offsetWidth < scroll)
			},
			classes() {
				return {
					'eventsSidebar--mini': this.isMini
				}
			},
			styles() {
				return {
					left: (this.scroll || 0) + 'px'
				}
			}
		}
	}
</script>

<template>
	<div class="eventsSidebar" :class="classes" :style="styles">
		<div class="eventsSidebar-group" v-for="rooms, floor in list">
			<div class="eventsSidebar-header">
				{{ floor }} этаж
			</div>
			<div class="eventsSidebar-item" v-for="room in rooms">
				<div
					class="eventsSidebar-itemContent"
					:class="{ 'eventsSidebar-itemContent--hover': room.id === selectedRoom }">
					<h6>
						{{ room.title }}
					</h6>
					<p>
						до {{ room.capacity }} человек
					</p>
				</div>
			</div>
		</div>
	</div>
</template>