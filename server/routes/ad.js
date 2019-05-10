let express = require('express');
let router = express.Router();

let res_rpc = {
  jsonrpc: "2.0",
  result: null
}

let db = require("../lib/db.class")
const DB = new db()

let ad = require("../controllers/ad.class")
const AD = new ad()

let util = require("../lib/util.class")
const UTIL = new util()

router.get('/', function (req, res, next) {
  res.send('Be yourself; everything else is taken.')
})

router.post('/register', async (req, res, next) => {
  let p = req.body.params

  if (validateNode(p.node) === false) {
    res_rpc.result = { error: "Invalid node" }
    res.status(400)
    res.send(JSON.stringify(res_rpc))
  }

  DB.insert("user", { node: p.node }).then(r => {
    res_rpc.result = { error: null, id: r.insertId }
    res.send(JSON.stringify(res_rpc))
  }).catch(e => {
    console.log("failed to insert")
    DB.select("user", "*", `node = "${p.node}"`).then(r => {
      res_rpc.result = { error: null, id: r[0].id }
      res.send(JSON.stringify(res_rpc))
    }).catch(e => {
      res_rpc.result = { error: "Couldn't insert data." }
      res.status(400)
      res.send(JSON.stringify(res_rpc))
    })
  })
})

router.post('/access', async (req, res, next) => {
  let p = req.body.params
  let ref = req.header('Referer')
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (ref.match(/https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+/) == null) {
    console.log(ref + " isnt matched")
    res.status(403)
    return res.send(JSON.stringify(res_rpc))
  }
  if (ip == null) {
    console.log(ip + " isnt matched")
    res.status(403)
    return res.send(JSON.stringify(res_rpc))
  }

  console.log(p.user_id, ref, ip)


  DB.select("access", "user_id, ip", `user_id = ${p.user_id} AND ip = "${ip}"`).then(r => {
    if (r.length === 0) {
      DB.insert("access", { user_id: p.user_id, referrer: ref, ip: ip }).then(r => {
        res_rpc.result = { error: null }
        res.send(JSON.stringify(res_rpc))
      }).catch(e => {
        throw e
      })
    } else {
      throw "Duplicate Access"
    }
  }).catch(e => {
    res_rpc.result = { error: e }
    res.send(JSON.stringify(res_rpc))
  })
})

router.post('/claim', async (req, res, next) => {
  let p = req.body.params

  if (validateNode(p.node) === false) {
    res_rpc.result = { error: "Invalid node" }
    res.status(400)
    res.send(JSON.stringify(res_rpc))
  }

  DB.select("user", "id", `node = "${p.node}"`).then(r => {
    if (r.length === 1) {
      DB.select("access", "*", `user_id = ${r[0].id}`).then(r2 => {
        res_rpc.result = { error: null, rate: r2.length }
        res.send(JSON.stringify(res_rpc))
      }).catch(e => {
        throw e
      })
    } else {
      throw `duplicate node info are registered.`
    }
  }).catch(e => {
    res_rpc.result = { error: e }
    res.status(400)
    res.send(JSON.stringify(res_rpc))
  })
})

function validateNode(node) {
  let rxId = "^[0-9a-f]+"
  let rxDomain = "(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?"
  let rxIp = "(([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])"
  let rxPort = "([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])"
  let rx = new RegExp(`${rxId}@(${rxDomain}|${rxIp}):${rxPort}`)
  if (typeof node != "string" || node.match(rx) == null) {
    return false
  }
  return true
}

module.exports = router
