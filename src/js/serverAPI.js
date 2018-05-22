const URL_TO_GET_ARTICLES = '//81.177.101.213/ajax/test.json';

export default {
	getArticles: function () {
		return new Promise(function (resolve, reject) {
			let req = new XMLHttpRequest();
			req.open('get', URL_TO_GET_ARTICLES);
			req.onload = function () {
				if (req.status === 200) {
					resolve(req.response)
				} else {
					reject(new Error("Server error"))
				}
			};

			req.onerror = function() {
				reject(new Error("Network error"));
			};

			req.send();
		});
	}
}