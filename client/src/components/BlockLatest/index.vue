<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
const QRious = require('qrious');

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
			let test = false
			let msatoshi = 135000
			if(this.$route.name === "BlockLatestTest") {
				test = true
				msatoshi = 1000
			}

			this.rpc("read", "pay", { msatoshi: msatoshi }, true, test, 10000).then(r => {
				console.log(r)

				this.payreq = "lightning:" + r.invoice.payreq
				new QRious({
					element: this.$refs.payreq,
					value: r.invoice.payreq,
					size: 190,
					foreground: 'darkgreen',
					background: '#EEFFEE'
				});

				this.node = "lightning:" + r.node
				new QRious({
					element: this.$refs.node,
					value: r.node,
					size: 190,
					foreground: 'darkgreen',
					background: '#EEFFEE'
				});

				let param_common = {
					id: r.invoice.id,
					timeout: 11 * 60 * 1000,
					block: this.block,
					lang: this.$i18n.locale,
					token: this.$route.query.token
				}
				setTimeout(() => {
					let p = Object.assign({ img: [0, -1] }, param_common)
					this.rpc("read", "if_pay_then_read", p, false, test).then(res => {
						let range = [0, 5]
						p = Object.assign({ img: range }, param_common)
						this.rpc("read", "if_pay_then_read", p, true, test).then(r => {
							for(let i=range[0]; r.img[i]; i++) {
								this.img.push({
									id: `page_${i+1}`,
									src: 'data:image/jpeg;base64,' + r.img[i],
									next: `#page_${i+2}`
								})
							}
							this.img_loaded = true

							range = [6]
							p = Object.assign({ img: range }, param_common)
							this.rpc("read", "if_pay_then_read", p, false, test).then(r => {
								for(let i=range[0]; r.img[i]; i++) {
									this.img.push({
										id: `page_${i+1}`,
										src: 'data:image/jpeg;base64,' + r.img[i],
										next: `#page_${i+2}`
									})
								}
							})
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
