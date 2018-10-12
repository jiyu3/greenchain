<template src="./template.html"></template>
<style src="./style.css"></style>

<script>
export default {
	mounted() {
		document.getElementById("notify").appendChild(this.$parent.$refs["btn-notify"])
	}
}
</script>
