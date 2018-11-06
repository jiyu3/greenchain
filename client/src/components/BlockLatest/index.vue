<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
let QRCode = require("qrcode")

export default {
	data() {
		let block = this.$store.state.block.latest
		return {
			loaded: true,
			payreq: null,
			node: null,
			qr: {
				payreq: null,
				node: null
			},
			block: block,
			prev: `/block/${block - 1}`,
			img: [],
			img_loaded: false
		}
	},
	methods: {
		init() {
			if( this.$i18n.locale != "ja" &&
				this.$i18n.locale != "zh-cn" &&
				this.$i18n.locale != "zh-tw") {
				this.$i18n.locale = "ja"
			}

			this.rpc("cln", "pay", { msatoshi: 10000 }, false).then(r => {
				console.log(r)
				this.payreq = "lightning:" + r.invoice.payreq
				QRCode.toDataURL(r.invoice.payreq, (err, qr) => {
					this.qr.payreq = qr
				})
				this.node = "lightning:" + r.node
				QRCode.toDataURL(r.node, (err, qr) => {
					this.qr.node = qr
				})

				setTimeout(() => {
					this.rpc("cln", "if_pay_then_read", { id: r.invoice.id, timeout: 11 * 60 * 1000, block: this.block, lang: this.$i18n.locale }, false).then(r => {
						r.img.forEach((e, i) => {
							this.img.push({
								id: `page_${i+1}`,
								src: 'data:image/jpeg;base64,' + r.img[i],
								next: `#page_${i+2}`
							})
						})
						this.img_loaded = true
					})
				}, 0)
			}).catch(e => {
				console.log(e)
			})
		}
	},
	watch: {
		"$i18n.locale"(v) {
			this.init()
		},
	},
	created() {
		this.init()
	},
}
</script>
