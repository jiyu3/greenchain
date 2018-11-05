let express = require('express');
let router = express.Router();

let res_rpc = {
	jsonrpc: "2.0",
	result: null
}

let db = require("../lib/db.class")
const DB = new db()

let cln = require("../controllers/cln.class")
const CLN = new cln()

let util = require("../lib/util.class")
const UTIL = new util()

let CHARGE = `http://api-token:midori@test.cln.green:9112`
let NODE = `031201e62297a420a3878d0d8b7c4206553d354097da1a9e7c34158303d9223569@testnet.cln.green:9735`

let request = require("request")

router.get('/', function (req, res, next) {
	res.send('Be yourself; everything else is taken.')
})

let fee = {
	manga: 2
}

router.post('/pay', async (req, res, next) => {
	let p = req.body.params

	request.post(`${CHARGE}/invoice`, { form: { msatoshi: p.msatoshi } }, (err, resp, body) => {
		if (err) {
			res_rpc.result = { error: err }
		} else {
			res_rpc.result = { error: null, invoice: JSON.parse(body), node: NODE }
		}
		res.send(JSON.stringify(res_rpc))
	});
})

router.post('/if_pay_then_read', async (req, res, next) => {
	let p = req.body.params
	let fs = require("fs")
	let url = `${CHARGE}/invoice/${p.id}/wait?timeout=${p.timeout}`

	request.get(url, (err, resp, body) => {
		console.log(body)
		body = JSON.parse(body)
		if (body.msatoshi_received < fee.manga) {
			res_rpc.result = Object.assign({ error: "insufficient fee" }, { img: null })
			res.json(JSON.stringify(res_rpc))
			return false
		}

		let i = 0
		let images = []
		let promises = []
		while (1) {
			let imgPath = __dirname + `/../blocks/${p.block}/${p.lang}/${i}.jpg`
			if (fs.existsSync(imgPath)) {
				let index = i.toString()
				promises.push(
					UTIL.readFileAsync(imgPath).then(img => {
						images[index] = img
					})
				)
				i++
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
