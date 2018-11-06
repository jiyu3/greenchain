module.exports = class UTIL {
	constructor() {
		this.fs = require("fs")
	}

	/**
	 * hash by Sha256 twice.
	 * @param {string} [target] - this string is to be hashed
	 * @return {string} double-hased string
	 */
	doubleHash(target) {
		let sha256 = require("sha256")
		return sha256.x2(target)
	}

	/**
	 * Read file asynchronously.
	 * @param {string} file file path
	 * @param {string} encode encoding method, default is base64
	 * @return {object} Promise
	 */
	readFileAsync(file, encode = "base64") {
		return new Promise((resolve, reject) => {
			this.fs.readFile(file, encode, (err, data) => {
				if (err) {
					reject(err)
					return
				}
				resolve(data)
			})
		})
	}
}
