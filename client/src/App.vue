<template>
	<div id="app">
		<header>
			<div>
				<router-link id="logo" class="btn" to="/">Green Chain</router-link>
				<select v-model="locale">
					<option value='ja'>日本語</option>
					<option value='en'>English</option>
					<option value='zh-cn'>簡体中文</option>
					<option value='zh-tw'>繁體中文</option>
					<!-- <option value = 'fr'>français</option> -->
				</select>
				<router-link id="logo" class="btn" to="/sponsor">sponsor</router-link>
			</div>
		</header>
		<router-view id="main" />

		<footer id="footer">
			<b-col>
				<div class="sns">
					<a :href="twitter_link" target="_blank" title="Share on Twitter">
						<img :src="twitter" class="twitter" alt="twitter">
					</a>
					<a :href="facebook_link" target="_blank" title="Share on Facebook">
						<img :src="facebook" class="facebook" alt="facebook">
					</a>
				</div>

				<div id="contact">
					<a href="https://twitter.com/fkazuja" target="_blank">contact</a>
				</div>
			</b-col>
		</footer>

		<div ref="btn-notify" id="btn-notify" class="onesignal-customlink-container"></div>
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
			if(language.startsWith("ja")) {
				locale = "ja"
			} else if(language.startsWith("zh-cn")) {
				locale = "zh-cn"
			} else if(language.startsWith("zh-cn")) {
				locale = "zh-tw"
			} else {
				locale = "en"
			}
		}
		this.$i18n.locale = locale

		let description = document.getElementById("description").getAttribute("content")
		let tw =  "https://twitter.com/intent/tweet?text=" + encodeURIComponent(description + "\n" + location.href + "\n" + " #GreenChain")
		let fb = "https://www.facebook.com/sharer/sharer.php?u=" + location.href + "&t=" + encodeURIComponent(description)

		return {
			locale: locale,
			show: true,
			twitter: require("./images/twitter.png"),
			facebook: require("./images/facebook.png"),
			twitter_link: tw,
			facebook_link: fb,
		}
	},
	watch: {
		locale(v) {
			localStorage.locale = this.$i18n.locale = v
		},
		"$route.name"(v) {
			let ad = document.getElementById("gc_ad_main")
			if(ad == void 0) {
				return false
			}

			if(v === "Sponsor") {
				ad.style.display = "block"
			} else {
				ad.style.display = "none"
			}
		}
	},
	methods: {
	},
	mounted() {
	}
}
</script>

<style>
/* Common */
html, #app, img, header {
	background-color: #e1fae1 !important;
	font-size: 18px;
}

#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}

body {
	font-size: 3rem;
	background-color: #e6ffe6;
}

#locale {
	font-size: 14px;
}

/* Heading */

h1 {
  font-size: 3rem;
}
h2 {
  font-size: 2rem;
}
h3 {
  font-size: 1.75rem;
}
h4 {
  font-size: 1.5rem;
}
h5 {
  font-size: 1.25rem;
}
h6 {
  font-size: 1rem;
}

/* Button */

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

/* Anker */

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

/* Header */

header {
	width: 100%;
	position: fixed;
	top: 0;
	border-bottom: 1px solid darkgreen;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
	height: 45px;
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

/* footer */

footer {
	border-top: 1px solid darkgreen;
	margin-top: 50px;
}

footer + #btn-notify {
	display: none !important;
}

.twitter, .facebook {
	width: 10%;
	max-width: 50px;
	margin-left: 10px;
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

/* Ads */

#gc_ad_main {
	display: none;
}
</style>
