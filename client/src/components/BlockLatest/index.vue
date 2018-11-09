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
				alert("Not translated into the language you specified yet.")
				localStorage.locale = this.$i18n.locale = "ja"
				return location.reload()
			}

			let test = false
			let msatoshi = 135000
			if(this.$route.name === "BlockLatestTest") {
				test = true
				msatoshi = 1000
			}

			this.rpc("cln", "pay", { msatoshi: msatoshi }, true, test).then(r => {
				console.log(r)
				this.payreq = "lightning:" + r.invoice.payreq
				QRCode.toDataURL(r.invoice.payreq, (err, qr) => {
					this.qr.payreq = qr
				})
				this.node = "lightning:" + r.node
				QRCode.toDataURL(r.node, (err, qr) => {
					this.qr.node = qr
				})

				let param_common = {
					id: r.invoice.id,
					timeout: 11 * 60 * 1000,
					block: this.block,
					lang: this.$i18n.locale
				}
				setTimeout(() => {
					let p1 = Object.assign({ img: [0, -1] }, param_common)
					this.rpc("cln", "if_pay_then_read", p1, false, test).then(r => {
						this.img_loaded = true

						this.$store.state.loader = this.$loading.show()
						let p2 = Object.assign({ img: [0, 2] }, param_common)
						this.rpc("cln", "if_pay_then_read", p2, false, test).then(r => {
							for(let i=0; i<r.img.length; i++) {
								this.img.push({
									id: `page_${i+1}`,
									src: 'data:image/jpeg;base64,' + r.img[i],
									next: `#page_${i+2}`
								})
							}
							this.$store.state.loader.hide()
						})

						let p3 = Object.assign({ img: [3] }, param_common)
						this.rpc("cln", "if_pay_then_read", p3, false, test).then(r => {
							for(let i=3; i<r.img.length; i++) {
								this.img.push({
									id: `page_${i+1}`,
									src: 'data:image/jpeg;base64,' + r.img[i],
									next: `#page_${i+2}`
								})
							}
						})
					})
				}, 5000)
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
