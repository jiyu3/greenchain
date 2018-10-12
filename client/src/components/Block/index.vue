<template src="./template.html"></template>
<style src="./style.css"></style>

<script>
export default {
	data() {
		let block = +this.$route.params.id
		return {
			loaded: false,
			visible: [true],
			nb_block: block,
			event: null,
			img: [
				{
					id: "page_0",
//					src: null,
					src: null,
					next: "#page_1"
				}
			],
			prev: `/block/${block - 1}`,
			next: `/block/${block + 1}`
		}
	},
	methods: {
		handleScroll(nb_page) {
			let elem = this.$refs[`page_${nb_page}`][0]
			if(elem === void 0) {
				return false;
			}
			if(!this.visible[nb_page]) {
				let top = elem.getBoundingClientRect().top
				this.visible[nb_page] = top < window.innerHeight + 100
			}
			if(this.visible[nb_page]) {
				window.removeEventListener('scroll', this.event)

				let src = null
				try {
					src = require(`../../images/blocks/${this.nb_block}/${this.$i18n.locale}/${nb_page+1}.jpg`)
				} catch(e) {
					document.getElementById(`page_${nb_page}`).href = "#footer"
					return false
				}

				this.img.push({
					id: `page_${nb_page+1}`,
//					src: 'data:image.png;base64,' + r.img,
					src: src,
					next: `#page_${nb_page+2}`
				})

				this.event = () => {
					this.handleScroll(nb_page+1)
				}
				window.addEventListener('scroll', this.event)


				// this.rpc("block", "read", { nb_block: this.nb_block, nb_page: nb_page+5, lang: this.$i18n.locale }, false).then(r => {
				// 	console.log("loaded: " + `page_${nb_page+5}`)
				// 	this.img.push({
				// 		id: `page_${nb_page+5}`,
				// 		src: 'data:image.png;base64,' + r.img,
				// 		next: `#page_${nb_page+6}`
				// 	})

				// 	this.event = () => {
				// 		this.handleScroll(nb_page+1)
				// 	}
				// 	window.addEventListener('scroll', this.event)
				// }).catch(e => {
				// 	document.getElementById(`page_${nb_page}`).href = "#footer"
				// })
			}
		},
		init() {
			this.loaded = false

			this.img = []
			this.img = [{
				id: `page_0`,
				src: require(`../../images/blocks/${this.nb_block}/${this.$i18n.locale}/0.jpg`),
				next: `#page_1`
			},
			{
				id: `page_1`,
				src: require(`../../images/blocks/${this.nb_block}/${this.$i18n.locale}/1.jpg`),
				next: `#page_2`
			}]

			this.loaded = true

			if(this.event != null) {
				window.removeEventListener('scroll', this.event)
			}
			this.event = () => {
				this.handleScroll(1)
			}
			window.addEventListener('scroll', this.event)
		}
	},
	watch: {
		"$i18n.locale"(v) {
			this.init()
		},
		"$route.params.id"(v) {
			window.scrollTo(0, 0)
			v = +v
			this.nb_block = v
			this.prev = `/block/${v - 1}`
			this.next = `/block/${v + 1}`
			this.init()
		}
	},
	async created() {
// 		for(let i=0; i<5; i++) {
// 			// let r = await this.rpc("block", "read", { nb_block: this.nb_block, nb_page: i, lang: this.$i18n.locale }, true)
// 			this.img[i] = {
// 				id: `page_${i}`,
// //				src: 'data:image.png;base64,' + r.img,
// 				src: require(`../../images/blocks/${block}/${this.$i18n.locale}/${page}.jpg`),
// 				next: `#page_${i+1}`
// 			}
// 		}
		this.init()
	}
}
</script>
