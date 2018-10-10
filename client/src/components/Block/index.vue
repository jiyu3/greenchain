<template src="./template.html"></template>
<style src="./style.css"></style>

<script>
export default {
	data() {
		return {
			loaded: false,
			img: null,
			visible: [true],
			nb_block: this.$route.params.id,
			event: null
		}
	},
	methods: {
		handleScroll(nb_page) {
			if(nb_page >= 12) {
				return false;
			}
			let elem = document.getElementById(`page_${nb_page}`)
			if(!this.visible[nb_page]) {
				let top = elem.getBoundingClientRect().top
				this.visible[nb_page] = top < window.innerHeight + 100
			}
			if(this.visible[nb_page]) {
				window.removeEventListener('scroll', this.event)

				this.rpc("block", "read", { nb_block: this.nb_block, nb_page: nb_page+1, lang: this.$i18n.locale }, false).then(r => {
					console.log(`page${nb_page}, 0.0000001btc paid`)

					// this.rpc("pay", "/", { user_id: 1, content_id: `read_${this.nb_block}_${nb_page+1}` }).then(r => {
					// 	console.log(r)
					// })
					// カラー切替ボタン

					let newImg = document.createElement("img")
					newImg.src = r.img
					newImg.id = (`page_${nb_page+1}`)
					this.$refs.read_manga.appendChild(newImg)

					this.event = () => {
						this.handleScroll(nb_page+1)
					}
					window.addEventListener('scroll', this.event)
				})
			}
		}
	},
	watch: {
		visible(v) {
			console.log(`${v} is visible.`)
		}
	},
	created() {
		this.rpc("block", "read", { nb_block: this.nb_block, nb_page: 0, lang: this.$i18n.locale }, true).then(r => {
			this.rpc("pay", "/", { user_id: 1, content_id: `read_${this.nb_block}_0` }).then(r => {
				console.log(r)
			})

			this.img = r.img
			this.event = () => {
				this.handleScroll(0)
			}
			window.addEventListener('scroll', this.event)
		}).finally(r => {
			this.loaded = true
		})
	}
}
</script>
