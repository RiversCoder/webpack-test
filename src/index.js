import _ from 'lodash';

fuction component(){
	let element = document.cretaeElement("div")
	element.innerHTML = _.join(['Hello','webpack'], ' ')
	
	return element
}

document.body.appendChild(component())
