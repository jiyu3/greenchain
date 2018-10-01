<template>
	<div id="app">
		<header>
			<div>
				<router-link class="btn" to="/">Green Chain</router-link>
				<div id="locale">
					<a href="javascript:void(0)" @click="locale = 'ja'">日本語</a>
					<a href="javascript:void(0)" @click="locale = 'en'">English</a>
				</div>
			</div>
		</header>
		<router-view id="main" />
		<div id="heart_fav" ref="heart_fav">
			<transition>
				<img v-if="heart_display" :src="heart" />
			</transition>
		</div>
		<div id="heart" @click="fav">
			<div style="background:white;">{{ nb_fav }}</div>
			<img :src="heart" />
		</div>
		<!-- <div ref="btn-notify" id="btn-notify" class="onesignal-customlink-container"></div> -->
	</div>
</template>

<script>
export default {
	data() {
		let locale = localStorage.getItem("locale") ? localStorage.getItem("locale") : null
		if(!locale) {
			let language = (window.navigator.languages && window.navigator.languages[0]) ||
				window.navigator.language ||
				window.navigator.userLanguage ||
				window.navigator.browserLanguage;
			if(language.startsWith("en")) {
				locale = "en"
			} else if(language.startsWith("ja")) {
				locale = "ja"
			} else if(language.startsWith("zh-cn")) {
				locale = "zh-cn"
			} else {
				locale = "zh-tw"
			}
		}
		this.$i18n.locale = locale

		return {
			locale: locale,
			show: true,
			heart: require("./images/heart.png"),
			nb_fav: 30,
			heart_display: false
			// logo: require("./images/logo.png"),
			// twitter: require("./images/twitter.png"),
			// facebook: require("./images/facebook.png"),
			// twitter_link: null,
			// facebook_link: null
		}
	},
	watch: {
		locale(v) {
			localStorage.locale = this.$i18n.locale = v
			location.reload()
		}
	},
	methods: {
		fav() {
			this.rpc("pay", "/", { user_id: 1, content_id: `like_1_1` }).then(r => {
				console.log(r)
			})

			this.nb_fav++

			var r1 = Math.floor(Math.random()*100)
			var r2 = Math.floor(Math.random()*100)
			var r3 = Math.floor(Math.random()*100)

			this.$refs.heart_fav.setAttribute("style", `
				z-index:99999;
				position:fixed;
				width: 15%;
				top: ${r2}%;
				left: ${r3}%;
			`)
			this.$refs.heart_fav.width = "200px";
			this.heart_display = true
			setTimeout(() => {
				this.heart_display = false
			}, 0)
		}
	},
	mounted() {
	}
}
</script>

<style>
html, #app, img, .logo, header {
	background-color: #e1fae1 !important;
	font-size: 18px;
}

.v-leave-active {
  transition: opacity 0.5s;
}
.v-leave-to {
  opacity: 0.5;
}

#heart {
	opacity: 0.7;
	position: fixed;
	z-index: 999999;
	bottom: 0;
	right: 0;
	width: 15%;
}

#heart_fav {
	z-index:99999;
	position:fixed;
	width: 15%;
	top: 50%;
	left: 50%
}

#heart img, #heart_fav img {
	width: 100%;
}

/* .btn-success {
	color: white !important;
}

.row {
	margin-top: 20px;
}

.row:last-child {
	margin-bottom: 20px;
}

.back {
	margin-bottom: 20px;
	border: 1px solid green !important;
} */

.logo img {
	height: 40px;
}

#locale {
	font-size: 14px;
}

/* #btn-notify {
	display: none;
}

#main a:not(.btn) {
	background-color: white;
	color: green;
	font-weight: bold !important;
}

html a:visited {
	color: darkgreen;
}


footer a, footer a:hover {
	color: green;
	font-weight: bold !important;
}

 footer a:not(:first-child) {
	margin-left: 5px;
} */

#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}

header {
	width: 100%;
	position: fixed;
	top: 0;
	border-bottom: 1px solid darkgreen;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
}

header a:hover, header .router-link-exact-active {
	background-color: white;
}

header > div {
	width: 100%;
	max-width: 750px;
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
}

header a {
	color:green;
}

header a:hover {
	color: green;
}

header a:active {
	color: green;
}

header a:visited {
	color: darkgreen;
}

header .btn {
	margin-left: 2%;
}

/* footer {
	margin-top: 50px;
	border-top: 1px solid darkgreen;
}

h3 {
	margin-bottom: 20px;
}

.twitter {
	width: 10%;
	margin-right: 10px;
}

.facebook {
	width: 10%;
	margin-left: 10px;
}

.sns {
	margin-top: 20px;
}

.to_top {
	margin-top: 20px;
	margin-bottom: 20px;
}

.to_top .btn {
	background-color: white;
	border: 1px solid green;
}

#contact {
	font-size: 14px;
	margin-bottom: 20px;
} */

.btn-success {
	background-image: -webkit-linear-gradient(top,#5cb85c 0,#419641 100%);
	background-image: -o-linear-gradient(top,#5cb85c 0,#419641 100%);
	background-image: -webkit-gradient(linear,left top,left bottom,from(#5cb85c),to(#419641));
	background-image: linear-gradient(to bottom,#5cb85c 0,#419641 100%);
	filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff5cb85c', endColorstr='#ff419641', GradientType=0);
	filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);
	background-repeat: repeat-x;
	border-color: #3e8f3e;
}

.btn-default {
	text-shadow: 0 1px 0 #fff;
	background-image: -webkit-linear-gradient(top,#fff 0,#e0e0e0 100%);
	background-image: -o-linear-gradient(top,#fff 0,#e0e0e0 100%);
	background-image: -webkit-gradient(linear,left top,left bottom,from(#fff),to(#e0e0e0));
	background-image: linear-gradient(to bottom,#fff 0,#e0e0e0 100%);
	filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffffff', endColorstr='#ffe0e0e0', GradientType=0);
	filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);
	background-repeat: repeat-x;
	border-color: #000;
}

h1 {
  font-size: 6rem;
}
h2 {
  font-size: 5rem;
}
h3 {
  font-size: 4rem;
}
h4 {
  font-size: 3rem;
}
h5 {
  font-size: 2rem;
}
h6 {
  font-size: 1rem;
}

body {
	font-size: 3rem;
	background-color: #e6ffe6;
}

a:link {
	color: #068900;
}
a:visited {
	color: #015400;
}
a:hover {
	color: #068900;
}
a:active {
	color: #068900;
}

#twitter-widget-1 {
	margin-right: 10px;
}

.facebook {
	margin-top: 5px;
	margin-bottom: 10px;
}

.fb-like {
	margin-right: 10px;
}
</style>
