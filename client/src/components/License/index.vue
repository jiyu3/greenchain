<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
export default {
	data() {
		return {
			copy: "Copy to Clipboard"
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
