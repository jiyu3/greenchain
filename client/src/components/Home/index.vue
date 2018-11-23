<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
export default {
	mounted() {
		document.getElementById("notify").appendChild(this.$parent.$refs["btn-notify"])
		if (this.$route.query.id) {
			this.rpc("ad", "access", { user_id: this.$route.query.id }).then(r => {
				console.log(r)
			}).catch(e => {
				console.log(e)
			})
		}
	}
}
</script>
