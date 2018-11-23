<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
export default {
	data() {
		return {
			node: null,
			node_claim: null,
			ad_text : `<script>window.gc_ad_position = "bottom right"; window.gc_ad_fps = "5";<\/script><script src="//${location.host}/gc_ad.js" id="0"><\/script>`,
			copy: "Copy to Clipboard",
			rate: null
		}
	},
	methods: {
		onCopy() {
			let toast = this.$toasted.show("Copied!", {
				theme: "bubble",
				position: "top-center",
				duration : 1500
			})
			this.copy = "Copied!"
		},
		onCopyError() {
			let toast = this.$toasted.show("Failed", {
				theme: "outline",
				position: "top-center",
				duration : 1500
			})
		},
		register() {
			let rxId = "^[0-9a-f]+"
			let rxDomain = "[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}"
			let rxIp = "(([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])"
			let rxPort = "([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])"
			let rx = new RegExp(`${rxId}@(${rxDomain}|${rxIp}):${rxPort}`)
			if(typeof this.node != "string" || this.node.match(rx) == null) {
				let toast = this.$toasted.show("Wrong node", {
					theme: "outline",
					position: "bottom-center",
					duration : 1500
				})
				return true
			}

			this.rpc("ad", "register", { node: this.node }, true).then(r => {
				console.log("r", r)
				this.ad_text = this.ad_text.replace(/id="[a-z0-9]+"/, `id="${r.id}"`)
				let toast = this.$toasted.show("Registered! Copy ad text and use it.", {
					theme: "bubble",
					position: "bottom-center",
					duration : 1500
				})
			}).catch(e => {
				console.log(e)
				let toast = this.$toasted.show("Failed to register", {
					theme: "outline",
					position: "bottom-center",
					duration : 1500
				})
			})
		},
		claim() {
			document.querySelector("#rate span").innerHTML =
				document.querySelector("#rate span").innerHTML.replace("m@manga.green", "<a href='mailto:m@manga.green'>m@manga.green</a>")
			this.rpc("ad", "claim", { node: this.node_claim }, true).then(r => {
				this.rate = r.rate
				if(this.rate == 0) {
					let toast = this.$toasted.show("No access yet", {
						theme: "outline",
						position: "bottom-center",
						duration : 1500
					})
				}
			}).catch(e => {
				let toast = this.$toasted.show("Failed to claim", {
					theme: "outline",
					position: "bottom-center",
					duration : 1500
				})
			})
		}
	}
}
</script>
