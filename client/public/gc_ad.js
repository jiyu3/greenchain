let ad = document.createElement("div")
ad.id = "gc_ad_main"
ad.style = `
	position: fixed;
	${gc_ad_position.includes("bottom") ? "bottom" : "top" }: 0;
	${gc_ad_position.includes("right") ? "right" : "left" }: 0;
	z-index: 999999;
	width: 100px;
	height: 100px;
`
let ad_link = document.createElement("a")
ad_link.id = "gc_ad_link"
ad_link.href = location.origin
ad_link.target = "_blank"
ad.appendChild(ad_link)

let ad_img = document.createElement("img")
ad_img.id = "gc_ad_img"
ad_img.src = `${location.origin}/midori_mine1.png`
ad_img.style = `
	width: 100%;
`
ad_link.appendChild(ad_img)

window.onload = () => {
	document.body.appendChild(ad);
	if (isNaN(gc_ad_fps) || gc_ad_fps < 0) {
		gc_ad_fps = 5
	}

	(function loop(nb_img) {
		if (++nb_img > 4) {
			nb_img = 1
		}
		ad_img.src = `${location.origin}/midori_mine${nb_img}.png`
		setTimeout(loop, 1000/gc_ad_fps, nb_img)
	})(0);
}
