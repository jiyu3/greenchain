<template src="./template.html"></template>
<style src="./style.css"></style>

<script>
export default {
	data() {
		return {
			ad_text : `<script>window.gc_ad_position = "bottom right"; window.gc_ad_fps = "5";<\/script><script src="${location.origin}/gc_ad.js"><\/script>`
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
		}
	}
}
</script>
