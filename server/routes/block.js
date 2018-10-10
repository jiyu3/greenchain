let express = require('express');
let router = express.Router();

let res_rpc = {
	jsonrpc: "2.0",
	result: null
}

let db = require("../lib/db.class")
const DB = new db()

let btcpay = require('btcpay')

// let block = require("../controllers/block.class")
// const BLOCK = new block()

router.get('/', function (req, res, next) {
//	res.send('Be yourself; everything else is taken.')
	var keypair = btcpay.crypto.generate_keypair()
	console.log("keypair", keypair)
	res.send(keypair)
})

router.get('/btc', function (req, res, next) {
	let r;
	try {
		let client = new btcpay.BTCPayClient('http://localhost:9998', keypair)
		r = client
	} catch (e) {
		r = e
	}
	res.send(r)
})

router.post('/read', async function (req, res, next) {
	let p = req.body.params
	let fs = require("fs")
	let path = require('path');

	let block = ""
	let page = ""
	if (p.nb_block < 10) {
		block = `0000${p.nb_block}`
		if (p.nb_page < 10) {
			page = `${p.nb_block}000${p.nb_page}`
		} else {
			page = `${p.nb_block}00${p.nb_page}`
		}
	} else {
		block = `000${p.nb_block}`
		if (p.nb_page < 10) {
			page = `${p.nb_block}000${p.nb_page}`
		} else {
			page = `${p.nb_block}00${p.nb_page}`
		}
	}


	console.log(p.lang)
//	let imgPath = path.join(__dirname, '..', 'blocks', block, 'ja', `${page}.jpg`);
	let imgPath = `http://localhost:9998/${block}/${p.lang}/${page}.jpg`
	console.log("imgPath", imgPath)
//	let img = fs.readFileSync(imgPath)
	res_rpc.result = Object.assign({ error: null }, { img: imgPath })
	res.json(JSON.stringify(res_rpc))
	return true;

	// // pay with lightning
	// payWithLightNing(p.fee)

	// // monitor lnd node
	// let interval = setInterval(function () {
	// 	if (lndPayment() === true) {
	// 		let fs = require("fs")
	// 		let path = getImagePath(p.nb_block, p.nb_page) // get image file path from episode number and page number
	// 		let img = fs.readFileSync(path)

	// 		if (img) {
	// 			// Encode to base64(decode on server)
	// 			let encodedImage = new Buffer(img, 'binary').toString('base64')
	// 			return encodedImage
	// 		} else {
	// 			payBackToLnd()
	// 			return false
	// 		}
	// 	}
	// }, 100)
})

router.post('/fav', async function (req, res, next) {
	let p = req.body.params

	DB.insert("fav", { user_id: p.user_id, nb_block: p.nb_block, nb_page: p.nb_page }).then(data => {
		res_rpc.result = Object.assign({ error: null }, data[0])
		res.status(200)
		res.json(JSON.stringify(res_rpc))
	}).catch(e => {
		console.log(e)
		res.status(500)
		res.json(JSON.stringify(res_rpc))
	})
})

router.post('/getfavs', async function (req, res, next) {
	let p = req.body.params

	DB.select("fav", "user_id, like", `nb_block=${p.nb_block} AND nb_page=${p.nb_page}`).then(data => {
		res_rpc.result = Object.assign({ error: null }, data[0])
		res.status(200)
		res.json(JSON.stringify(res_rpc))
	}).catch(e => {
		console.log(e)
		res.status(500)
		res.json(JSON.stringify(res_rpc))
	})
})

module.exports = router
