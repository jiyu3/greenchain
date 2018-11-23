module.exports = class DB {
	constructor() {
		let mysql = require('mysql')
		let conf = require('../config.json')
		this.db = mysql.createConnection(conf.db)
		this.db.connect()
	}

	select(table, value, where = "1", others) {
		let query = `SELECT ${value} FROM ${table} WHERE ${where} `
		if (others) {
			query += others
		}
		return this._q(query)
	}

	/**
	 * set should be like: { id: 10, name: "jiyu", email: "m@jiyu.lol" }
	 */
	update(table, set, where) {
		let _set = ""
		Object.keys(set).forEach(key => {
			_set += `${key} = "${set[key]}",`
		})
		_set = _set.slice(0, -1)

		let query = `UPDATE ${table} SET ${_set} WHERE ${where}`
		return this._q(query)
	}

	/**
	 * set should be like: { id: 10, name: "jiyu", email: "m@jiyu.lol" }
	 */
	insert(table, set) {
		let fields = "("
		let values = "("
		Object.keys(set).forEach(key => {
			fields += key + ","
			values += '"' + set[key] + '",'
		})
		fields = fields.slice(0, -1) + ")"
		values = values.slice(0, -1) + ")"

		let query = `INSERT INTO ${table} ${fields} VALUES ${values}`
		return this._q(query)
	}

	_q(query) {
		return new Promise((resolve, reject) => {
			this.db.query(query, function (error, results, fields) {
				if (error) {
					console.log({ error: error.code, query: query })
					reject(error)
				} else {
					console.log({ query: query })
					resolve(results)
				}
			})
		})
	}
}

