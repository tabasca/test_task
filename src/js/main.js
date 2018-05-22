import { getElementFromTemplate, isNextPageAvailable, closestByClass } from './utils';
import api from './serverAPI';

const Promise = require('promise-polyfill');

//IE polyfill for template strings
import 'core-js/es6/symbol';
import 'core-js/fn/symbol/iterator';

if (!window.Promise) {
	window.Promise = Promise;
}

(function () {
	let articlesWrap = document.querySelector('.js-articles-wrap');
	let delBtnClass = 'js-delete-article';
	let articleItemClass = 'article';
	let showMoreBtn = document.querySelector('.js-show-more');

	const PAGE_SIZE = 4;

	let articles = [];
	let renderedArticles = [];
	let currentPage = 0;

	let isRenderingAllowed = true;

	let getArticleHTML = (data) => {
		return `<article class="article" data-id="${data.id}" style="background-image: url('${data.imageUrl}')">
					<span class="article__title">${data.name}</span>
					<div class="article__hover-block">
						<span class="article__descr">${data.text}</span>
						<button class="btn js-delete-article">Delete</button>
					</div>
				</article>`;
	};

	let renderArticles = (items, page) => {
		let from = page * PAGE_SIZE;
		let to = from + PAGE_SIZE;

		let container = document.createDocumentFragment();

		items.slice(from, to).forEach(function(item) {
			let itemHTML = getElementFromTemplate(getArticleHTML(item));
			renderedArticles.push(itemHTML);
			container.appendChild(itemHTML);
		});

		articlesWrap.insertBefore(container, articlesWrap.firstChild);
	};

	let renderNextPages = (reset) => {
		if (reset) {
			currentPage = 0;
			renderedArticles.forEach(function(item) {
				item.parentNode.removeChild(item);
			});

			renderedArticles = [];
		}

		window.scrollTo(0, 0);

		renderArticles(articles, currentPage);
		currentPage++;

		if (!isNextPageAvailable(articles.length, currentPage, PAGE_SIZE)) {
			showMoreBtn.style.display = 'none';
		}
	};

	let loadArticles = () => {
		isRenderingAllowed = false;
		api.getArticles()
			.then(JSON.parse)
			.then( response => {
					isRenderingAllowed = true;
					articles = response[0].data;
					renderArticles(articles, currentPage);
					currentPage++;
				}
			)
			.catch(
				err => {
					isRenderingAllowed = true;
					console.log('errored while uploading items data! err:', err);
				}
			);
	};

	loadArticles();

	showMoreBtn.addEventListener('click', (evt) => {
		evt.preventDefault();

		isRenderingAllowed && renderNextPages();
	});

	articlesWrap.addEventListener('click', (evt) => {
		if (evt.target.classList.contains(delBtnClass)) {
			let articleItem = closestByClass(evt.target, articleItemClass);

			articleItem.parentNode.removeChild(articleItem);
		}
	})

})();