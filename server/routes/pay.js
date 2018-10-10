let express = require('express')
let router = express.Router()

let res_rpc = {
	jsonrpc: "2.0",
	result: null
}

let db = require("../lib/db.class")
const DB = new db()

let fs = require('fs')
let util = require('util')
let log_file = fs.createWriteStream(__dirname + '/server.log', {flags : 'a'})
let log_stdout = process.stdout

console.log = function(d) {
	log_file.write(util.format(d) + '\n')
	log_stdout.write(util.format(d) + '\n')
}

let grpc = require('grpc')
let protoLoader = require('@grpc/proto-loader')

// let pay = require("../controllers/pay.class")
// const PAY = new pay()

router.get('/', function (req, res, next) {
	res.send('Be yourself everything else is taken.')
	console.log(req)
})

router.post('/', function (req, res, next) {
	console.log("POST /pay at " + Date())

	console.log(req.body)
	// パラメーターを取り出す
	let user_id = req.body.user_id
	let content_id = req.body.content_id

	let epoch = Date.now()
	let invoice_name = '{"content_id":"' + content_id + '","user_id":"' + user_id + '","epoch":"' + epoch + '"'
	let price = 1

	const options = {
		keepCase: true,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true
	}
	let lnrpc = grpc.loadPackageDefinition(protoLoader.loadSync(__dirname + '/rpc.proto', options)).lnrpc

	let host3 = "btcpaytest3.indiesquare.net:443"
	let sslCreds3 = grpc.credentials.createSsl()
	let macaroon3 = "0201036c6e6402bb01030a107bf042ce1d8a0da8c81a1e725d0f271f1201301a160a0761646472657373120472656164120577726974651a130a04696e666f120472656164120577726974651a170a08696e766f69636573120472656164120577726974651a160a076d657373616765120472656164120577726974651a170a086f6666636861696e120472656164120577726974651a160a076f6e636861696e120472656164120577726974651a140a0570656572731204726561641205777269746500000620e8d0f36c72451b380ae6760aba3ea0916f11f89da6b7796e993b35603d78949e"
	let macaroonCreds3 = grpc.credentials.createFromMetadataGenerator(function(args, callback) {
		let metadata = new grpc.Metadata()
		metadata.add('macaroon', macaroon3)
		callback(null, metadata)
	})

	let creds3 = grpc.credentials.combineChannelCredentials(sslCreds3 , macaroonCreds3)
	let lightning3 = new lnrpc.Lightning(host3, creds3)

	let host6 = "btcpaytest6.indiesquare.net:443"
	let sslCreds6 = grpc.credentials.createSsl()
	let macaroon6 = "0201036c6e6402bb01030a10fedbc471d003d162a9873fc60be999ad1201301a160a0761646472657373120472656164120577726974651a130a04696e666f120472656164120577726974651a170a08696e766f69636573120472656164120577726974651a160a076d657373616765120472656164120577726974651a170a086f6666636861696e120472656164120577726974651a160a076f6e636861696e120472656164120577726974651a140a0570656572731204726561641205777269746500000620c3b3a92f749841136e3e5366b8846332551ee276a4c07a061a949639ebba8733"
	let macaroonCreds6 = grpc.credentials.createFromMetadataGenerator(function(args, callback) {
		let metadata = new grpc.Metadata()
		metadata.add('macaroon', macaroon6)
		callback(null, metadata)
	})
	let creds6 = grpc.credentials.combineChannelCredentials(sslCreds6 , macaroonCreds6)
	let lightning6 = new lnrpc.Lightning(host6, creds6)

	// lightning3 に請求書を作らせる
	// lightning6 に請求書へ支払わせる

	let addInvoiceRequest = {
		memo: invoice_name,
		value: price
	}
	lightning3.addInvoice(addInvoiceRequest, function(invoiceErr, addInvoiceResponse) {
		if(invoiceErr != undefined){
			console.error("error: " + invoiceErr)
			res_rpc.result = Object.assign({ error: invoiceErr }, { code: 1 })
			res.json(JSON.stringify(res_rpc))
			return true

		} else {
			let sendPaymentRequest = {
				payment_request: addInvoiceResponse.payment_request,
			}
			lightning6.sendPaymentSync(sendPaymentRequest, function(paymentErr, sendPaymentResponse) {

				if(paymentErr !== void 0) {
					console.error("error: " + paymentErr)
					res_rpc.result = Object.assign({ error: paymentErr }, { code: 1 })
					res.json(JSON.stringify(res_rpc))
					return true

				} else {
					res_rpc.result = Object.assign({ error: null }, { code: 0 })
					res.json(JSON.stringify(res_rpc))
					return true
				}
			})
		}
	})
})

module.exports = router
