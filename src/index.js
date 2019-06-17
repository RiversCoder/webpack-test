import _ from 'lodash'
import printMe from './project.js'
import './style.css'

function component(){

	var element = document.createElement("div")
	element.innerHTML = _.join(['Hello ','webpack'], ' ')
	
	element.classList.add('box')

	// 新增点击按钮
	var btn = document.createElement('button')
	btn.innerHTML = '点击我会打印信息';
	btn.onclick = printMe

	element.appendChild(btn)

	return element 
}

document.body.appendChild(component())

if (module.hot) {
   module.hot.accept('./project.js', function() {
     console.log('获取更新的project.js内容');
     printMe();
   })
}


/*let element = component(); // 当 print.js 改变导致页面重新渲染时，重新获取渲染的元素
document.body.appendChild(element);

  if (module.hot) {
    module.hot.accept('./project.js', function() {
      console.log('Accepting the updated printMe module!');

     document.body.removeChild(element);
     element = component(); // 重新渲染页面后，component 更新 click 事件处理
     document.body.appendChild(element);
    })
  }*/