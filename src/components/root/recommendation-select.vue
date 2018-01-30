
<script>
	import cIcon from '@/components/general/icon'
	import { mapState, mapGetters } from 'vuex'

	export default {
		name: 'cr-recommendation-select',

		components: {
			cIcon
		},

		props: {
			recommendation: Array,
			room: String,
			date: Object
		},

		data() {
			return {
				mRoom: this.room
			}
		},

		watch: {
			room(val) {
				this.setRoom(val)
			}
		},

		computed: {
			...mapGetters([
				'getRoomById'
			]),

			selected() {
				const { date, mRoom } = this
				const room = mRoom && this.getRoomById(mRoom)

				if (room) {
					return {
						date,
						room
					}
				}

				return undefined
			},
			list() {
				const selected = this.selected

				return selected
					? [selected]
					: this.recommendation
			},
		},

		methods: {
			setRoom(room) {
				this.mRoom = room
			},
			changeRecommendation(recommendation) {
				if (recommendation) {
					this.setRoom(recommendation.room.id)
				}

				this.$emit('change', recommendation)
			}
		}
	}
</script>

<template>
	<div class="crRecommendationSelect">
		<div
			class="crRecommendationSelect-item"
			v-for="item in list"
			:class="{ 'crRecommendationSelect-item--selected': !!selected }"
			@click="changeRecommendation(item)">
			<div class="crRecommendationSelect-title">
				<span>
					{{ item.date.start | date('T') }} —
					{{ item.date.end | date('T') }}
				</span>
				{{ item.room.title }} ·
				{{ item.room.floor }} этаж
			</div>
			<div
				class="crRecommendationSelect-close"
				v-if="!!selected"
				@click.stop="changeRecommendation()">
				<c-icon id="asset_icon_close"></c-icon>
			</div>
		</div>
		<div class="crRecommendationSelect-empty" v-if="!list.length">
			Ничего нет :(
		</div>
	</div>
</template>