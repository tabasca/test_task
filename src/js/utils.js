export let getElementFromTemplate = (templateHtml) => {
	let template = document.createElement('div');
	template.innerHTML = templateHtml;

	return template.firstChild;
};

export let isNextPageAvailable = (listSize, page, pageSize) => {
	return page < Math.ceil(listSize / pageSize);
};

export let closestByClass = (el, clazz) => {
	while (el.className !== clazz) {
		el = el.parentNode;
		if (!el) {
			return null;
		}
	}
	return el;
};