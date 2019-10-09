"use strict";
(function () {
	// 获取对应元素
	const calendarYear = document.querySelector('.calYear');
	const calendarList = document.querySelector('.calList');
	const calendarCont = document.querySelector('.calDetail');

	const weekLists = ['日', '一', '二', '三', '四', '五', '六'];	// 工作日标题
	const items = [
		{
			id: '',
			schedule: [
				// { time: '11:00 - 12:00', event: 'go to school' },
				// { time: '10:00 - 11:00', event: 'go shopping' },
			],
			target: [
				// { state: false, event: 'go to store' },
				// { state: true, event: 'watch moive' },
				// { state: false, event: 'watch moive' },
			],
			essay: [
				// 'Live the way you want to be Live the way you want to be','Live the way you want to be'
			]
		}
	]

	/* calList function start here*/
	// 获取当前日期,格式为yyyy/MM/dd
	function getNowFormatDate() {
		const date = new Date();
		//日期分隔符
		let seperator1 = '/';
		let year = date.getFullYear();				// 年
		let month = date.getMonth() + 1;			// 月
		let day = date.getDate();					// 日
		let currentDate = '';

		if (month >= 1 && month <= 9) {// 月份不够两位补"0"
			month = '0' + month;
		}
		if (day >= 1 && day <= 9) {// 天数不够两位补"0"
			day = '0' + day;
		}
		// 拼接日期字符串
		currentDate = year + seperator1 + month + seperator1 + day;
		return currentDate;
	}

	// 生成星期与日期
	function wrapWithLi() {
		let weekStr = '';	// 存放星期字符串
		let dayStr = '';	// 存放具体日期字符串

		// 获取当前年份与月份
		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth() + 1;
		// 计算当前月份对应天数、当前日期和当前星期
		const currenMonthDay = new Date(currentYear, currentMonth, 0).getDate();
		const currentDate = new Date().getDate();
		const currentDay = new Date().getDay();

		
		// 生成星期
		for (let week of weekLists) {
			weekStr += `<li class="calendar_week">${week}</li>`;
		}

		// 根据当前月份1号是星期几产生空白占位符
		let firstDay = new Date();
		firstDay.setDate(1);// 获取当前月份1号是星期几
		for (let i = 0; i < weekLists.length; i++) {
			if (firstDay.getDay() > i) {
				dayStr += `<li class="calendar_block"></li>`;
			}
		}
		
		// 根据当前时间，动态生成日期
		for (let i = 1; i <= currenMonthDay; i++) {
			if (i === currentDate) {
				dayStr += `<li class="current_day" data-index="${i}">${i}</li>`;
			} else {
				dayStr += `<li class="calendar_item" data-index="${i}">${i}</li>`;
			}
		}

		return weekStr + dayStr;
	}

	// 鼠标选择高亮
	function currHightlight() {
		const lis = document.querySelectorAll('.calendar_item');
		for (let li of lis) {
			li.addEventListener('mouseover', function () {
				li.className = 'mouse_on';
			})
			li.addEventListener('mouseout', function () {
				li.className = 'calendar_item';
			})
		} 
	}

	/* calDetail function start here*/
	// 渲染 calDetail 模版
	function renderDetail() {
		let str = '';
		// 获取当前日期与星期
		const currentDate = getNowFormatDate();
		const currentWeek = new Date().getDay();

		// 时间
		str += `<div class="detItem date">${currentDate} 星期${weekLists[currentWeek]}<span class="off">add</span></div>`;

		// 行程
		str += `<div class="detItem"><span class="itemTitle">行程</span>`
		str += `${items.map(item => 
			`${
				item.schedule.length === 0 ?
				`<span>今天没任何行程安排</span>` :
				item.schedule.map(arg => `
					<span class="itemTime">${arg.time}</span>
					<p>${arg.event}</p>
				`).join('')
			}`
		)}`.trim()
		str += `</div>`

		// 目标
		str += `<div class="detItem"><span class="itemTitle">任务</span>`
		str += `${items.map(item => 
			`${
				item.target.length === 0 ?
				`<span>今天没任何任务安排</span>` :
				item.target.map(tar => `
					${
						tar.state ? 
						'<span class="icon_on"></span><span class="state_on">完成</span><p class="complete">'+tar.event+'</p>' :
						'<span class="icon_off"></span><span class="state_off">未完成</span><p>'+tar.event+'</p>'
					}
				`).join('')
			}`
		)}`.trim()
		str += `</div>`

		// 随笔
		str += `<div class="detItem"><span class="itemTitle">随笔</span>`;
		str += `${items.map(item => 
			item.essay.length === 0 ?
			`<span>今天没任何随笔内容</span>` :
			item.essay.map(ess => `
				<p>${ess}</p>
			`).join('')
		)}`.trim()
		str += `</div>`
		return str;
	}

	// add按钮事件处理
	function addEvent() {
		const addBar = document.querySelector('.addBar');
		const addBtn = document.querySelector('.date span');
		addBtn.addEventListener('click', function () {
			this.classList.replace('off','on');
			addBar.classList.replace('hide','show');
		})
	}

	/* addBar function start here*/
	// 当前选中选项卡
	function currTag() {
		// 获取进行操作的元素
		let lis = document.querySelectorAll('.addMenu li');
		let itemGroups = document.querySelectorAll('.itemGroup');
		let textGroups = document.querySelectorAll('.textGroup');
		let span = document.querySelectorAll('.addBar .count span');
		let doit = document.querySelectorAll('.addBar .doit');

		let i = 0, len = lis.length;
		for (; i < len; i++) {
			let li = lis[i];
			// 给当前选中li设置自定义属性，用来记录当前索引值，后面内容的显示需要用到当前li的索引值
			li.setAttribute('index', i);
			li.addEventListener('click', function () {
				for (let i = 0; i < len; i++) {
					// 清空每一个选项卡类名
					lis[i].className = '';
				}
				this.classList.add('selected');

				// 遍历每一个文本域并根据当前被选中项显示对应内容
				for (let i = 0; i < textGroups.length; i++) {
					textGroups[i].classList.replace('show','hide');
				}
				let index = ~~this.getAttribute('index');
				textGroups[index].classList.replace('hide','show');

			})
		}
	}

	// 行程时间处理
	function scheduleEvent() {
		// 获取当前时钟和分钟,两者都为number类型
		const currentHours = new Date().getHours();
		const currentMinutes = new Date().getMinutes();
		// 获取操作元素
		const selects = document.querySelectorAll('.itemGroup select');
		const startHours = selects[0];		// 开始时间的时钟位
		const startMinutes = selects[1];	// 开始时间的分钟位
		const endHours = selects[2];			// 结束时间的时钟位
		const endMinutes = selects[3];		// 结束时间的分钟位
		let hoursStr = '';		// 存放生成的时钟位字符串
		let minutesStr = '';	// 存放生成的分钟位字符串

		// 根据当前时间生成时钟选项
		computeHours({
			i: currentHours,
			els: [
				{ node: startHours, str: '<option value="00">00</option>' },
				{ node: endHours, str: '<option value="00">00</option>' },
			]
		})

		// 生成分钟选项
		computeMinutes({
			i: currentMinutes,
			els: [
				{ node: startMinutes, str: '' },
				{ node: endMinutes, str: '' },
			]
		})

		// 遍历每一个select,生成正确时间
		for (let i = 0; i < selects.length; i++) {
			let select = selects[i];
			// 给每一个单独的select设置change事件,监听它们值改变的情况,再动态拼接字符串
			select.addEventListener('change', function () {

				// 判断当前节点是否为开始时钟
				if (this.className.indexOf('startHours') !== -1) {
					// 处理开始时钟特殊情况 00的时候
					if (this.value === '00') {
						computeHours({
							i:0,
							els:[{node:endHours,str:''}]
						})
					}

					// 判断开始时钟是否大于结束时钟
					if (~~this.value > ~~endHours.value) {
						computeHours({
							i:~~this.value,
							els:[{node:endHours,str:'<option value="00">00</option>'}]
						})
					}

					// 开始时钟小于结束时钟时
					if(~~this.value < ~~endHours.value){
						// 清空
						hoursStr = '';
						for (let i = ~~this.value; i < 24; i++) {// 生成字符串模版
							// 保持结束时钟被选中项
							if (i === ~~endHours[endHours.selectedIndex].value) {
								hoursStr += `<option value="${i}" selected>${i}</option>`
							}else{
								if (('' + i).length === 1) {
									hoursStr += `<option value="0${i}">0${i}</option>`;
								}else{
									hoursStr += `<option value="${i}">${i}</option>`;
								}
							}
						}
						endHours.innerHTML = hoursStr + '<option value="00">00</option>';
					}

					// 开始时钟等于结束时钟时
					if(this.value === endHours.value){
						// 清空
						hoursStr = '';
						for (let i = ~~this.value; i < 24; i++) {// 生成字符串模版
							// 保持结束时钟被选中项
							if (i === ~~endHours[endHours.selectedIndex].value) {
								hoursStr += `<option value="${i}" selected>${i}</option>`
							}else{
								hoursStr += `<option value="${i}">${i}</option>`;
							}
						}
						endHours.innerHTML = hoursStr + '<option value="00">00</option>';
					}

					// 开始时钟等于当前时钟时
					if (~~this.value === currentHours) {
						computeMinutes({
							i:currentMinutes,
							els:[{node:startMinutes,str:'<option value="00">00</option>'}]
						})
					}

					// 开始时钟大于当前时钟时
					if (~~this.value > currentHours) {
						computeMinutes({
							i:0,
							els:[{node:startMinutes,str:''},{node:endMinutes,str:''},]
						})
					}
				}

				// 判断当前节点是不是结束时钟,
				if (this.className.indexOf('endHours')!== -1) {
					// 当结束时钟等于开始时钟时
					if (this.value === startHours.value) {
						computeMinutes({
							i:~~startMinutes.value,
							els:[{node:endMinutes,str:''},]
						})
					}

					// 当结束时钟不等于开始时钟时
					if (this.value !== startHours.value) {
						computeMinutes({
							i:0,
							els:[{node:endMinutes,str:''},]
						})
					}
				}

				// 判断当前节点是不是开始分钟,且
				if (this.className.indexOf('startMinutes')!== -1) {
					// 当结束时钟等于开始时钟时
					if (endHours.value === startHours.value) {
						computeMinutes({
							i:~~startMinutes.value,
							els:[{node:endMinutes,str:''},]
						})
					}

					// 当结束分钟小于开始分钟值时
					if (~~endMinutes.value < ~~startMinutes.value) {
						computeMinutes({
							i:~~startMinutes.value,
							els:[{node:endMinutes,str:''},]
						})
					}
				}

			})
		}
	}

	// 文本域及提交按钮处理
	function textBtnEvent() {
		let texts = document.querySelectorAll('.textGroup textarea');
		let span = document.querySelectorAll('.addBar .count span');
		let doit = document.querySelectorAll('.addBar .doit');

		// 给每一个单独的textarea添加input监听事件
		for (let i = 0; i < texts.length; i++) {
			let text = texts[i];
			// 给每一个单独文本域设置index
			text.setAttribute('index',i);
			text.addEventListener('input',function(){
				let inputLength = this.value.length;
				let index = ~~this.getAttribute('index');
				if (inputLength !== 0) {
					span[index].innerHTML = inputLength;
					doit[index].classList.replace('off','on');
				}else{
					span[index].innerHTML = 0;
					doit[index].classList.replace('on','off');
				}
				
			})
		}
	}

	// 用于处理所有时钟情况,生成相应模版
	function computeHours(body) {
		let tempStr = '';
		// 清空时钟字符串
		let hoursStr = '';
		for (let i = body.i; i < 24; i++) {
			if (('' + i).length === 1) {
				hoursStr += `<option value="0${i}">0${i}</option>`
			} else {
				hoursStr += `<option value="${i}">${i}</option>`
			}
		}
		// 遍历传入的元素数组,生成相应字符串
		for (let el of body.els) {
			tempStr += hoursStr + el.str;
			tempStr.trim();
			el.node.innerHTML = tempStr;
			tempStr = '';
		}
	}

	// 用于处理所有分钟情况,生成相应模版
	function computeMinutes(body) {
		let tempStr = '';
		// 清空时钟字符串
		let minutesStr = '';
		for (let i = body.i; i < 60; i++) {
			if (('' + i).length === 1) {
				minutesStr += `<option value="0${i}">0${i}</option>`
			} else {
				minutesStr += `<option value="${i}">${i}</option>`
			}
		}
		// 遍历传入的元素数组,生成相应字符串
		for (let el of body.els) {
			tempStr += minutesStr + el.str;
			tempStr.trim();
			el.node.innerHTML = tempStr;
			tempStr = '';
		}
	}

	// 处理异步提交
	function handleSubmit(){
		// 获取doit按钮并添加
		let doits = document.querySelectorAll('.addBar .doit');
		let texts = document.querySelectorAll('.textGroup textarea');
		for (let i = 0; i < doits.length; i++) {
			let doit = doits[i];
			doit.setAttribute('index',i);
			doit.addEventListener('click',function(){
				if (this.className.indexOf('on') !== -1) {
					// 如果当前点击的是行程内的提交
					console.log(this);
				}
			})
		}
		
	}
	handleSubmit();

	calendarList.innerHTML = wrapWithLi();
	calendarYear.innerHTML = getNowFormatDate();
	calendarCont.innerHTML = renderDetail();
	currHightlight(); // 鼠标选择高亮
	addEvent();				// add按钮事件处理
	currTag();				// 当前选中选项卡
	scheduleEvent();	// 行程时间处理
	textBtnEvent();		// 文本域及提交按钮处理
	


})();

