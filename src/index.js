function component(){
	var element = document.createElement("div")
	element.innerHTML = lod.join(['Hello ','webpack'], ' ') // 调用 lodash
	
	return element 
}

document.body.appendChild(component())





