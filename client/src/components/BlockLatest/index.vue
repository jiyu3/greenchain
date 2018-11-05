<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
let QRCode = require("qrcode")

export default {
	data() {
		let block = +this.$route.params.id
		return {
			loaded: true,
			qr: {
				payreq: null,
				node: null
			},
			block: block
// 			visible: [true],
// 			nb_block: block,
// 			event: null,
// 			img: [
// 				{
// 					id: "page_0",
// //					src: null,
// 					src: null,
// 					next: "#page_1"
// 				}
// 			],
// 			prev: `/block/${block - 1}`,
// 			next: `/block/${block + 1}`
		}
	},
	methods: {
		/*
			localStorage で値作成
			POST /invoice でインボイス作成
			POST /invoice/:id/webhook で localStorage 値つきのwebhook作成

			webhookが叩かれたら、DBにlocalStorageでpaidフラグを立てる

			1秒ごとにDBを読み込みに行き、localStorageにpaidフラグが立っていたら画像を規定回数読み込む
		*/
// 		handleScroll(nb_page) {
// 			let elem = this.$refs[`page_${nb_page}`][0]
// 			if(elem === void 0) {
// 				return false;
// 			}
// 			if(!this.visible[nb_page]) {
// 				let top = elem.getBoundingClientRect().top
// 				this.visible[nb_page] = top < window.innerHeight + 100
// 			}
// 			if(this.visible[nb_page]) {
// 				window.removeEventListener('scroll', this.event)

// 				let src = null
// 				try {
// 					src = require(`../../images/blocks/${this.nb_block}/${this.$i18n.locale}/${nb_page+1}.jpg`)
// 				} catch(e) {
// 					document.getElementById(`page_${nb_page}`).href = "#footer"
// 					return false
// 				}

// 				this.img.push({
// 					id: `page_${nb_page+1}`,
// //					src: 'data:image.png;base64,' + r.img,
// 					src: src,
// 					next: `#page_${nb_page+2}`
// 				})

// 				this.event = () => {
// 					this.handleScroll(nb_page+1)
// 				}
// 				window.addEventListener('scroll', this.event)


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
		// 	}
		// },
		// init() {
		// 	this.loaded = false

		// 	this.img = []
		// 	this.img = [{
		// 		id: `page_0`,
		// 		src: require(`../../images/blocks/${this.nb_block}/${this.$i18n.locale}/0.jpg`),
		// 		next: `#page_1`
		// 	}]

		// 	this.loaded = true

		// 	if(this.event != null) {
		// 		window.removeEventListener('scroll', this.event)
		// 	}
		// 	this.event = () => {
		// 		this.handleScroll(0)
		// 	}
		// 	window.addEventListener('scroll', this.event)
		// }
	},
	watch: {
		// "$i18n.locale"(v) {
		// 	this.init()
		// },
		// "$route.params.id"(v) {
		// 	window.scrollTo(0, 0)
		// 	v = +v
		// 	this.nb_block = v
		// 	this.prev = `/block/${v - 1}`
		// 	this.next = `/block/${v + 1}`
		// 	this.init()
		// }
	},
	created() {
		this.rpc("cln", "get_node_info", { msatoshi: 137000 }, false).then(r => {
			console.log(r.invoice)

			QRCode.toDataURL(r.invoice.payreq, (err, qr) => {
				this.qr.payreq = qr
			})
			QRCode.toDataURL(r.node, (err, qr) => {
				this.qr.node = qr
			})

			this.rpc("cln", "if_pay_then_read", { id: "OHOYYjV4kj0ItuwVgvQ22", timeout: 11 * 60 * 1000, block: this.block, lang: this.$i18n.locale }, true).then(r => {
				console.log(r)
			})
		}).catch(e => {
			console.log(e)
		})

//		this.init()
	},
	mounted() {
	}
}
</script>
