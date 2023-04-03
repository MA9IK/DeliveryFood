window.addEventListener('DOMContentLoaded', () => {
	// Tabs
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

	// Timer

	const deadLine = '2023-04-02'

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

	// Modal

	const modal = document.querySelector('.modal')
	const modalDialog = document.querySelector('.modal__dialog')
	const modalOpenButtons = document.querySelectorAll('[data-modal]')
	let isModalOpen = false

	modalOpenButtons.forEach(button => {
		button.addEventListener('click', () => {
			openModal(modal, modalDialog)
			isModalOpen = true
		})
	})

	document.addEventListener('keydown', event => {
		if (event.code === 'Escape' && isModalOpen) {
			closeModal(modal, modalDialog)
		}
	})

	modal.addEventListener('click', event => {
		if (event.target === modal || event.target.hasAttribute('data-close')) {
			closeModal(modal, modalDialog)
			isModalOpen = false
		}
	})

	function openModal(blackScreen, dialog) {
		blackScreen.classList.add('show')
		dialog.classList.add('show')
		document.body.style.overflow = 'hidden'
		clearInterval(modalTimerId)
	}

	function closeModal(blackScreen, dialog) {
		blackScreen.classList.remove('show')
		dialog.classList.remove('show')
		document.body.style.overflow = ''
	}

	const modalTimerId = setTimeout(() => {
		openModal(modal, modalDialog)
	}, 3000)

	function showModalByScroll() {
		if (
			scrollY >=
			document.documentElement.scrollHeight -
				document.documentElement.clientHeight
		) {
			openModal(modal, modalDialog)
			document.removeEventListener('scroll', showModalByScroll)
		}
	}

	document.addEventListener('scroll', () => {
		showModalByScroll()
	})

	// Template

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

	new MenuDescription(
		'img/tabs/vegy.jpg',
		'vegy',
		'Меню "Фитнес"',
		`Меню "Фитнес" - это 
		новый подход к приготовлению блюд: 
		больше свежих овощей и 
		фруктов. Продукт активных и 
		здоровых людей. Это абсолютно 
		новый продукт с оптимальной 
		ценой и высоким качеством!`,
		9,
		'.menu__field .container'
	).render()
	new MenuDescription(
		'img/tabs/elite.jpg',
		'elite',
		'Меню “Премиум”',
		`В меню “Премиум” мы используем 
		не только красивый дизайн 
		упаковки, но и качественное 
		исполнение блюд. Красная рыба, 
		морепродукты, фрукты - 
		ресторанное меню без похода в 
		ресторан!`,
		14,
		'.menu__field .container'
	).render()
	new MenuDescription(
		'img/tabs/post.jpg',
		'post',
		'Меню "Постное"',
		`Меню “Постное” - это тщательный 
		подбор ингредиентов: полное 
		отсутствие продуктов животного 
		происхождения, молоко из миндаля, 
		овса, кокоса или гречки, правильное
	    количество белков за счет тофу и 
		импортных вегетарианских стейков.`,
		21,
		'.menu__field .container'
	).render()

	// Forms

	const forms = document.querySelectorAll('form')

	const message = {
		loading: 'Loading',
		success: "Thanks! I'll get you response!",
		failure: 'Oh... somethings went wrong...',
	}

	forms.forEach(item => postData(item))

	function postData(form) {
		form.addEventListener('submit', event => {
			event.preventDefault()
			const statusMessage = document.createElement('div')
			statusMessage.classList.add('status')
			statusMessage.textContent = message.loading
			form.append(statusMessage)

			const request = new XMLHttpRequest()
			const formData = new FormData(form)

			request.open('POST', 'server.php')
			request.setRequestHeader('Content-type', 'application/json')

			const object = {}
			formData.forEach(function (value, key) {
				object[key] = value
			})
			const json = JSON.stringify(object)

			request.send(json)

			request.addEventListener('load', () => {
				if (request.status === 200) {
					console.log(request.response)
					form.reset()
					statusMessage.textContent = message.success

					setTimeout(() => {
						statusMessage.remove()
					}, 2000)
				} else {
					statusMessage.textContent = message.failure
				}
			})
		})
	}
})