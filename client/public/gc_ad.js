let ad = document.createElement("div")
ad.classList.add("gc_ad_main")
ad.style = `
	position: fixed;
	${gc_ad_position.includes("top") ? "top" : "bottom" }: 0;
	${gc_ad_position.includes("left") ? "left" : "right" }: 0;
	width: 100px;
	height: 100px;
	z-index: 999999;
`
let ad_link = document.createElement("a")
ad_link.classList.add("gc_ad_link")
ad_link.href = "https://manga.green"
ad_link.target = "_blank"
ad.appendChild(ad_link)

let user_id = document.currentScript.getAttribute("id")
if (user_id) {
	ad_link.href += `?id=${user_id}`
}

for (let i = 1; i < 5; i++) {
	let ad_img = document.createElement("img")
	ad_img.classList.add("gc_ad_img")
	ad_img.src = `https://manga.green/midori_mine${i}.png`
	ad_img.style = `
		width: 100%;
		height: 100%;
		display: none;
	`
	ad_link.appendChild(ad_img)
}


window.onload = () => {
	document.body.appendChild(ad);
	if (isNaN(gc_ad_fps) || gc_ad_fps < 0) {
		gc_ad_fps = 5
	}

	(function loop(nb_img) {
		if (++nb_img > 4) {
			nb_img = 1
		}

		let imgs = document.getElementsByClassName("gc_ad_img")
		for (let i = 1; i < 5; i++) {
			if (i === nb_img) {
				imgs[i-1].style.display = "block"
			} else {
				imgs[i-1].style.display = "none"
			}
		}

		setTimeout(loop, 1000/gc_ad_fps, nb_img)
	})(0);
}
