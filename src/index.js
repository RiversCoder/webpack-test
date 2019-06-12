import _ from 'lodash';
import printMe from './project.js'

function component(){
	let element = document.createElement("div")
	element.innerHTML = _.join(['Hello','webpack','爱心小兔字体'], ' ')
	
	element.classList.add('box')

	// 新增点击按钮
	let btn = document.createElement('button');
	btn.innerHTML = '点击我会打印信息';
	btn.onclick = printMe;

	element.appendChild(btn);

	return element 
}

document.body.appendChild(component())
