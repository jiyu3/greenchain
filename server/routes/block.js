let express = require('express');
let router = express.Router();

let res_rpc = {
	jsonrpc: "2.0",
	result: null
}

let db = require("../lib/db.class")
const DB = new db()

let block = require("../controllers/block.class")
const BLOCK = new block()

router.get('/', function (req, res, next) {
	res.send('Be yourself; everything else is taken.')
})

router.post('/read', async function (req, res, next) {
	let p = req.body.params
	let fs = require("fs")

	let imgPath = __dirname + `/../blocks/${block}/${p.lang}/${page}.jpg`
	fs.readFile(imgPath, "base64", (err, img) => {
		if (err) {
			res.status(500)
			res_rpc.result = Object.assign({ error: err }, { img: null })
			res.json(JSON.stringify(res_rpc))
		} else {
			res_rpc.result = Object.assign({ error: null }, { img: img })
			res.json(JSON.stringify(res_rpc))
		}
	})
	return true;
})

module.exports = router
