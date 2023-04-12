/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calculator.js":
/*!**********************************!*\
  !*** ./js/modules/calculator.js ***!
  \**********************************/
/***/ ((module) => {

function calc() {
	console.log(+localStorage.getItem('ratio'))
	const result = document.querySelector('.calculating__result span')
	let sex, height, weight, age, ratio

	if (localStorage.getItem('sex')) {
		sex = localStorage.getItem(sex)
	} else {
		sex = 'female'
		localStorage.setItem('sex', 'female')
	}

	if (localStorage.getItem('ratio')) {
		ratio = localStorage.getItem('ratio')
	} else {
		ratio = 1.375
		localStorage.setItem('ratio', 1.375)
	}

	function initLocalSettings(selector, activeClass) {
		const elements = document.querySelectorAll(selector)

		elements.forEach(elem => {
			elem.classList.remove(activeClass)
			if (elem.getAttribute('id') === localStorage.getItem('sex')) {
				elem.classList.add(activeClass)
			} else if (
				elem.getAttribute('data-ratio') === localStorage.getItem('ratio')
			) {
				elem.classList.add(activeClass)
			}
		})
	}

	initLocalSettings('#gender div', 'calculating__choose-item_active')
	initLocalSettings(
		'.calculating__choose_big div',
		'calculating__choose-item_active'
	)

	function calcTotal() {
		if (!sex || !height || !weight || !age || !ratio) {
			result.textContent = '____'
			return
		}

		if (sex === 'female') {
			result.textContent = Math.round(
				(447.6 + 9.2 * weight + 3.1 * height - 4.3 * age) * ratio
			)
		} else {
			result.textContent = Math.round(
				(88.36 + 13.4 * weight + 4.8 * height - 5.7 * age) * ratio
			)
		}
	}

	calcTotal()

	function getStaticInformation(selector, activeClass) {
		const elements = document.querySelectorAll(selector)

		elements.forEach(item => {
			item.addEventListener('click', element => {
				if (element.target.getAttribute('data-ratio')) {
					ratio = +element.target.getAttribute('data-ratio')
					localStorage.setItem('ratio', ratio)
				} else {
					sex = element.target.id
					localStorage.setItem('sex', sex)
				}
				elements.forEach(item => {
					item.classList.remove(activeClass)
				})

				element.target.classList.add(activeClass)
				calcTotal()
			})
		})
	}

	getStaticInformation('#gender div', 'calculating__choose-item_active')
	getStaticInformation(
		'.calculating__choose_big div',
		'calculating__choose-item_active'
	)

	function getDynamicInformation(inputSelector) {
		const input = document.querySelector(inputSelector)

		input.addEventListener('input', () => {
			if (input.value.match(/\D/gi)) {
				input.style.border = '1px solid red'
			} else {
				input.style.border = ''
			}

			switch (input.getAttribute('id')) {
				case 'height':
					height = +input.value
					break
				case 'weight':
					weight = +input.value
					break
				case 'age':
					age = +input.value
					console.log(age)
					break
			}
			calcTotal()
		})
	}
	getDynamicInformation('#height')
	getDynamicInformation('#weight')
	getDynamicInformation('#age')
}

module.exports = calc


/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((module) => {

function cards() {
	class MenuDescription {
		constructor(
			image,
			alt,
			subtitle,
			itemDescr,
			price,
			parentSelector,
			...classes
		) {
			this.image = image
			this.alt = alt
			this.subtitle = subtitle
			this.itemDescr = itemDescr
			this.price = price
			this.transfer = 27
			this.classes = classes
			this.parent = document.querySelector(parentSelector)
			this.changeToUAH()
		}

		changeToUAH() {
			this.price *= this.transfer
		}

		render() {
			let element = document.createElement('div')
			if (this.classes.length === 0) {
				this.element = 'menu__item'
				element.classList.add(this.element)
			} else {
				this.classes.forEach(className => element.classList.add(className))
			}
			element.innerHTML = `
			<img src=${this.image} alt=${this.alt}>
			<h3 class="menu__item-subtitle">${this.subtitle}</h3>
			<div class="menu__item-descr">${this.itemDescr}</div>
			<div class="menu__item-divider"></div>
			<div class="menu__item-price">
				<div class="menu__item-cost">Цена:</div>
				<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
			</div>
			`
			this.parent.append(element)
		}
	}

	axios.get('http://localhost:3000/menu').then(data =>
		data.data.forEach(({ img, altimg, title, descr, price }) => {
			new MenuDescription(
				img,
				altimg,
				title,
				descr,
				price,
				'.menu .container'
			).render()
		})
	)
}

module.exports = cards


/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

function forms() {
	const forms = document.querySelectorAll('form')
	const message = {
		loading: 'img/form/spinner.svg',
		success: "Thanks! I'll get you response! I'll call you soon.",
		failure: 'Oh, somethings went wrong...',
	}

	forms.forEach(item => bindPostData(item))

	const postData = async (url, data) => {
		const resolve = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: data,
		})

		return await resolve.json()
	}

	function bindPostData(form) {
		form.addEventListener('submit', event => {
			event.preventDefault()
			const statusMessage = document.createElement('img')
			statusMessage.src = message.loading
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`
			form.append(statusMessage)

			const formData = new FormData(form)

			const object = {}
			formData.forEach(function (value, key) {
				object[key] = value
			})

			const json = JSON.stringify(Object.fromEntries(formData.entries()))

			postData('http://localhost:3000/requests', json)
				.then(data => {
					console.log(data)
					showThanksModal(message.success)
					statusMessage.remove()
				})
				.catch(() => {
					showThanksModal(message.failure)
				})
				.finally(() => {
					form.reset()
				})
		})
	}

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog')

		prevModalDialog.classList.add('hide')
		openModal(modal, modalDialog)

		const thanksModal = document.createElement('div')
		thanksModal.classList.add('modal__dialog')
		thanksModal.innerHTML = `
			<div class="modal__content">

				<div class="modal__close" data-close>×</div>
				<div class="modal__title">${message}</div>

			</div>
		`
		document.querySelector('.modal').append(thanksModal)
		setTimeout(() => {
			thanksModal.remove()
			prevModalDialog.classList.add('show')
			prevModalDialog.classList.remove('hide')
			closeModal(modal, modalDialog)
		}, 4000)
	}
}

module.exports = forms


/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

function modal() {
	const modal = document.querySelector('.modal')
	const modalDialog = document.querySelector('.modal__dialog')
	const modalOpenButtons = document.querySelectorAll('[data-modal]')
	let isModalOpen = false

	modalOpenButtons.forEach(button => {
		button.addEventListener('click', () => {
			openModal(modal, modalDialog)
		})
	})

	document.addEventListener('keydown', event => {
		if (event.code === 'Escape') {
			closeModal(modal, modalDialog)
		}
	})

	modal.addEventListener('click', event => {
		if (event.target === modal || event.target.hasAttribute('data-close')) {
			closeModal(modal, modalDialog)
		}
	})

	function openModal(blackScreen, dialog) {
		blackScreen.classList.add('show')
		dialog.classList.add('show')
		document.body.style.overflow = 'hidden'
		isModalOpen = true
		clearInterval(modalTimerId)
	}

	function closeModal(blackScreen, dialog) {
		blackScreen.classList.remove('show')
		dialog.classList.remove('show')
		isModalOpen = false
		document.body.style.overflow = ''
	}

	const modalTimerId = setTimeout(() => {
		openModal(modal, modalDialog)
	}, 50000)

	document.addEventListener('scroll', () => {
		showModalByScroll()
	})

	function showModalByScroll() {
		if (
			scrollY >=
			document.documentElement.scrollHeight -
				document.documentElement.clientHeight -
				2
		) {
			openModal(modal, modalDialog)
			document.removeEventListener('scroll', showModalByScroll)
		}
	}
}

module.exports = modal


/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((module) => {

function slider() {
	const allSlides = document.querySelectorAll('.offer__slide'),
		prev = document.querySelector('.offer__slider-prev'),
		next = document.querySelector('.offer__slider-next'),
		current = document.querySelector('#current'),
		total = document.querySelector('#total'),
		slidesWrapper = document.querySelector('.offer__slider-wrapper'),
		slidesField = document.querySelector('.offer__slider-inner'),
		width = window.getComputedStyle(slidesWrapper).width,
		allSlider = document.querySelector('.offer__slider')

	let indexOfSlide = 1,
		offset = 0

	currentIndexOFSlide(allSlides)

	slidesField.style.cssText = `
    display: flex;
    transition: 0.5s all;
    width: ${100 * allSlides.length}%;
`

	slidesWrapper.style.overflow = 'hidden'

	allSlides.forEach(item => {
		item.style.width = width
	})

	allSlider.style.position = 'relative'
	const indicator = document.createElement('ol'),
		dots = []

	indicator.classList.add('carousel-indicators')
	allSlider.append(indicator)

	for (let i = 0; i < allSlides.length; i++) {
		const dot = document.createElement('li')
		dot.setAttribute('data-slide-to', i + 1)
		dot.classList.add('dot')
		if (i == 0) {
			dot.style.opacity = 1
		}
		indicator.append(dot)
		dots.push(dot)
	}

	next.addEventListener('click', () => {
		if (offset === takeDigital(width) * (allSlides.length - 1)) {
			offset = 0
		} else {
			offset += takeDigital(width)
		}

		slidesField.style.transform = `translateX(-${offset}px)`
		if (indexOfSlide == allSlides.length) {
			indexOfSlide = 1
		} else {
			indexOfSlide++
		}

		currentIndexOFSlide(allSlides)

		dotActive(dots)
	})

	prev.addEventListener('click', () => {
		if (offset === 0) {
			offset = takeDigital(width) * (allSlides.length - 1)
		} else {
			offset -= takeDigital(width)
		}

		slidesField.style.transform = `translateX(-${offset}px)`
		if (indexOfSlide == 1) {
			indexOfSlide = allSlides.length
		} else {
			indexOfSlide--
		}

		currentIndexOFSlide(allSlides)
		dotActive(dots)
	})

	dots.forEach(dot => {
		dot.addEventListener('click', e => {
			const slideTo = e.target.getAttribute('data-slide-to')

			indexOfSlide = slideTo

			offset = takeDigital(width) * (slideTo - 1)
			slidesField.style.transform = `translateX(-${offset}px)`
			dotActive(dots)
			currentIndexOFSlide(allSlides)
		})
	})

	function takeDigital(str) {
		return +str.replace(/\D/g, '')
	}

	function dotActive(allDots) {
		allDots.forEach(dot => (dot.style.opacity = '0.5'))
		allDots[indexOfSlide - 1].style.opacity = 1
	}

	function currentIndexOFSlide(slides) {
		if (slides.length < 10) {
			total.textContent = `0${slides.length}`
			current.textContent = `0${indexOfSlide}`
		} else {
			total.textContent = allSlides.length
			current.textContent = indexOfSlide
		}
	}
}

module.exports = slider


/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

function tabs() {
	const tabs = document.querySelectorAll('.tabheader__item'),
		tabContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items')

	function hideTabContent() {
		tabContent.forEach(item => {
			item.classList.add('hide')
			item.classList.remove('show', 'fade')
		})

		tabs.forEach(tab => {
			tab.classList.remove('tabheader__item_active')
		})
	}

	function showTabContent(index = 0) {
		tabContent[index].classList.add('show', 'fade')
		tabContent[index].classList.remove('hide')

		tabs[index].classList.add('tabheader__item_active')
	}

	hideTabContent()
	showTabContent()

	tabsParent.addEventListener('click', event => {
		const target = event.target

		if (target && target.classList.contains('tabheader__item')) {
			hideTabContent()
			tabs.forEach((item, index) => {
				if (target == item) {
					showTabContent(index)
				}
			})
		}
	})
}

module.exports = tabs


/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

function timer() {
	const deadLine = '2023-05-02'

	function getTimeRemaining(endTime) {
		const time = Date.parse(endTime) - new Date(),
			days = Math.floor(time / (1000 * 60 * 60 * 24)),
			hours = Math.floor((time / (1000 * 60 * 60)) % 24),
			minutes = Math.floor((time / 1000 / 60) % 60),
			seconds = Math.floor((time / 1000) % 60)

		return {
			total: time,
			days: days,
			hours: hours,
			minutes: minutes,
			seconds: seconds,
		}
	}

	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`
		} else {
			return num
		}
	}

	function setClock(selector, endTime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timeInterval = setInterval(updateClock, 1000)

		updateClock()

		function updateClock() {
			const time = getTimeRemaining(endTime)

			days.innerHTML = getZero(time.days)
			hours.innerHTML = getZero(time.hours)
			minutes.innerHTML = getZero(time.minutes)
			seconds.innerHTML = getZero(time.seconds)

			if (time.total <= 0) {
				clearInterval(timeInterval)
			}
		}
	}
	setClock('.timer', deadLine)
}

module.exports = timer


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
window.addEventListener('DOMContentLoaded', () => {
	const tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
		modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
		cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
		forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
		calculator = __webpack_require__(/*! ./modules/calculator */ "./js/modules/calculator.js"),
		slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js"),
		timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js")

	tabs()
	modal()
	cards()
	forms()
	calculator()
	slider()
	timer()
})

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map