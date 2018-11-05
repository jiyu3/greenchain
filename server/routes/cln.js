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

let CHARGE = `http://api-token:midori@test.cln.green:9112`
let NODE = `031201e62297a420a3878d0d8b7c4206553d354097da1a9e7c34158303d9223569@testnet.cln.green:9735`

let request = require("request")

router.get('/', function (req, res, next) {
	res.send('Be yourself; everything else is taken.')
})

router.post('/get_node_info', async (req, res, next) => {
	let p = req.body.params

	request.post(`${CHARGE}/invoice`, {form: {msatoshi: p.msatoshi}}, (err, resp, body) => {
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

	console.log("if_pay_then_read")
	request.get(url, (err, resp, body) => {
		console.log(`${p.id} has been paid!`)

		let i = 0
		let images = []
		while (1) {
			let imgPath = __dirname + `/../blocks/${p.block}/${p.lang}/${i++}.jpg`
			if (fs.existsSync(imgPath)) {
				fs.readFile(imgPath, "base64", (err, img) => {
					images[i] = img
				})
			} else {
				console.log(`${imgPath} does not exist`)
				break;
			}
		}
		res_rpc.result = Object.assign({ error: null }, { img: images })
		console.log("images", images)
		res.json(JSON.stringify(res_rpc))
	})
})


module.exports = router
