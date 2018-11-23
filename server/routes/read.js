let express = require('express');
let router = express.Router();

let res_rpc = {
	jsonrpc: "2.0",
	result: null
}

let db = require("../lib/db.class")
const DB = new db()

let read = require("../controllers/read.class")
const READ = new read()

let util = require("../lib/util.class")
const UTIL = new util()

// testnet
const tCHARGE = `http://api-token:midori@test.cln.green:9112`
const tNODE = `031201e62297a420a3878d0d8b7c4206553d354097da1a9e7c34158303d9223569@testnet.cln.green:9735`

// mainnet
const CHARGE = `http://api-token:d284b26fff3fc441e275a0048d8594a02641decd@cln.green:9112`
const NODE = `02009947c197575f5a948e1e4343c41dc2e6122a9bd644629afb919f30e1115ff8@cln.green:9735`

let request = require("request")

router.post('/', function (req, res, next) {
	res.send('Be yourself; everything else is taken.')
})

let FEE = {
	manga: 135000
}
let tFEE = {
	manga: 1000
}

router.post('/pay', async (req, res, next) => {
	let p = req.body.params
	let charge = p.test ? tCHARGE : CHARGE
	let node = p.test ? tNODE : NODE

	request.post(`${charge}/invoice`, { form: { msatoshi: p.msatoshi } }, (err, resp, body) => {
		if (err) {
			res_rpc.result = { error: err }
		} else {
			res_rpc.result = { error: null, invoice: JSON.parse(body), node: node }
		}
		res.send(JSON.stringify(res_rpc))
	});
})

router.post('/if_pay_then_read', async (req, res, next) => {
	let p = req.body.params
	let fs = require("fs")
	let charge = p.test ? tCHARGE : CHARGE
	let fee = p.test ? tFEE : FEE
	let url = `${charge}/invoice/${p.id}/wait?timeout=${p.timeout}`

	request.get(url, (err, resp, body) => {
		if (!resp) {
			res_rpc.result = Object.assign({ error: "Response is empty" }, { img: null })
			res.json(JSON.stringify(res_rpc))
			return false
		}

		if (resp.statusCode == 402) {
			res_rpc.result = Object.assign({ error: "Timeout: 402 payment required" }, { img: null })
			res.json(JSON.stringify(res_rpc))
			return false
		}

		body = JSON.parse(body)
		if (body.msatoshi_received < fee.manga) {
			res_rpc.result = Object.assign({ error: "Insufficient fee" }, { img: null })
			res.json(JSON.stringify(res_rpc))
			return false
		}

		if (resp.statusCode != 200) {
			res_rpc.result = Object.assign({ error: "Unknown error" }, { img: null })
			res.json(JSON.stringify(res_rpc))
			return false
		}

		let images = []
		let promises = []
		if (p.img[1] == null) {
			p.img[1] = Infinity
		}

		console.log(p.img)
		for (let i = p.img[0]; i <= p.img[1]; i++) {
			console.log(i)
			let imgPath = __dirname + `/../blocks/${p.block}/${p.lang}/${i}.jpg`
			if (fs.existsSync(imgPath)) {
				let index = i.toString()
				promises.push(
					UTIL.readFileAsync(imgPath).then(img => {
						images[index] = img
					})
				)
			} else {
				break;
			}
		}

		Promise.all(promises).then(() => {
			res_rpc.result = Object.assign({ error: null }, { img: images })
			res.json(JSON.stringify(res_rpc))
		})
	})
})

module.exports = router
