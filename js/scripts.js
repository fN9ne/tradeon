// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов 
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя 
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());

/*
let block = document.querySelector('.click');
block.addEventListener("click", function (e) {
	alert('Все ок ;)');
});
*/

/*
//Объявляем переменные
const parent_original = document.querySelector('.content__blocks_city');
const parent = document.querySelector('.content__column_river');
const item = document.querySelector('.content__block_item');
//Слушаем изменение размера экрана
window.addEventListener('resize', move);
//Функция
function move(){
	const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	if (viewport_width <= 992) {
		if (!item.classList.contains('done')) {
			parent.insertBefore(item, parent.children[2]);
			item.classList.add('done');
		}
	} else {
		if (item.classList.contains('done')) {
			parent_original.insertBefore(item, parent_original.children[2]);
			item.classList.remove('done');
		}
	}
}
//Вызываем функцию
move();
*/;
$(document).ready(function(){
	$('.header-burger').on('click', function() {
		$(this).toggleClass('active');
		$('.burger-content').toggleClass('active');
	});
	$('.burger-content__close').on('click', function() {
		$('.header-burger').removeClass('active');
		$('.burger-content').removeClass('active');
	});
	$('.popup__area').on('click', function() {
		$(this).closest('.popup').removeClass('active');
	});
	$('.header-account').on('click', function() {
		$('.popup-account').addClass('active');
	});
	function parallax(parent, direction, el, mode = 0) {
		let pos = parent.offset(),
		elem_left = pos.left,
		elem_top = pos.top,
		elem_width = parent.outerWidth(),
		elem_height = parent.outerHeight(),
		speed = el.attr('data-speed');
		$(window).on('scroll', function() {
			let topPos = $(window).scrollTop() - elem_top;
			topPos += 200;
			if (topPos < 0) topPos = 0;
			topPos/= 2;
			topPos/= speed;
			if (direction == 'top') {
				if (mode == 1) {
					el.css('transform', `translateY(-${topPos}px) rotate(8deg)`);
				} else {
					el.css('transform', `translateY(-${topPos}px)`);
				}
			}
			if (direction == 'bottom') {
				if (mode == 1) {
					el.css('transform', `translateY(${topPos}px) rotate(8deg)`);
				} else {
					el.css('transform', `translateY(${topPos}px)`);
				}
			}
			if (direction == 'left') {
				if (mode == 1) {
					el.css('transform', `translateX(-${topPos}px) rotate(8deg)`);
				} else {
					el.css('transform', `translateX(-${topPos}px)`);
				}
			}
			if (direction == 'right') {
				if (mode == 1) {
					el.css('transform', `translateX(${topPos}px) rotate(8deg)`);
				} else {
					el.css('transform', `translateX(${topPos}px)`);
				}
			}
		});
	}
	setTimeout(() => {
		parallax($('.welcome'), 'top', $('.welcome__circles_1'));
		parallax($('.welcome'), 'top', $('.welcome__circles_2'));
		parallax($('.welcome'), 'top', $('.welcome__circles_3'));
		parallax($('.welcome'), 'top', $('.welcome__circles_4'));
		parallax($('.welcome'), 'left', $('.welcome__ill-item_awp'), 1);
		parallax($('.welcome'), 'left', $('.welcome__ill-item_m4a4'), 1);
		parallax($('.welcome'), 'left', $('.welcome__ill-item_bizon'), 1);
		parallax($('.welcome'), 'left', $('.welcome__ill-item_knife'), 1);
		parallax($('.welcome'), 'left', $('.welcome__ill-item_ak'), 1);
		parallax($('.why-we'), 'left', $('.why-we__shield'));
		parallax($('.why-we'), 'bottom', $('.why-we__circles'));
	}, 100);
});