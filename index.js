const bases = {
	10: "0123456789",
	2: "01",
	8: "01234567",
	16: "0123456789ABCDEF"
};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // Максимум и минимум включаются
}

function generateSecret(length, base, random = getRandomIntInclusive) {
	let secret = "";
	let sign = "";
	for(let i=0;i<length;i++){
		sign = bases[base][random(bases[base][0], bases[base][bases[base].length-1])];
		while(secret.indexOf(sign) != -1){
			sign = bases[base][random(bases[base][0], bases[base][bases[base].length-1])];
		}
		secret += sign;
	}
	return secret;
}

function evaluateGuess(secret, guess) {
	const res = secret.split("").map((el, ind, arr) => {
		if(el == guess[ind])
			return "b";
		else if(guess.split("").filter((elem) => elem == el).length != 0)
			return "c";
		else
			return;
	});
	const bsum = res.filter((el) => el == "b").length;
	const csum = res.filter((el) => el == "c").length;	
	return {bulls: bsum, cows: csum};
}

function createDigitValidator(base) {
	return function(char) {
		if(bases[base].indexOf(char.toUpperCase()) != -1)
			return true;
		return false;
	};
}

function isValidGuess(guess, length, base) {
	const validator = createDigitValidator(base);
	function checkRepeat(el, ind, arr) {
		return arr.filter((elem) => elem == el).length == 1;
	}
	return guess.length == length && guess.split("").every(validator) && guess.split("").every(checkRepeat);
}

function createElement(options) {
 // Default values
 const { tag = 'div', text = '', parent, classes = [] } = options;

 const element = document.createElement(tag);
 element.textContent = text;

 // Adding classes if provided
 if (classes.length > 0) {
  element.classList.add(...classes);
 }

 // Adding the element to the parent element if necessary
 if (parent != null) {
  parent.appendChild(element);
 }

 return element; // Returning the created element for further manipulations
}

function createModal() {
	const overlay = createElement({classes: ['fixed-overlay']});
	const modal = createElement({parent: overlay, classes: ["modal-window"]});
	const lsel = createElement({tag: "select", parent: modal});
	createElement({tag: "option", text: "Choose length", parent: lsel}).value = "";
	createElement({tag: "option", text: "2", parent: lsel}).value = "2";
	createElement({tag: "option", text: "3", parent: lsel}).value = "3";
	createElement({tag: "option", text: "4", parent: lsel}).value = "4";
	createElement({tag: "option", text: "5", parent: lsel}).value = "5";
	createElement({tag: "option", text: "6", parent: lsel}).value = "6";
	const bsel = createElement({tag: "select", parent: modal});
	createElement({tag: "option", text: "Choose base", parent: bsel}).value = "";
	createElement({tag: "option", text: "Bin", parent: bsel}).value = "Bin";
	createElement({tag: "option", text: "Oct", parent: bsel}).value = "Oct";
	createElement({tag: "option", text: "Dec", parent: bsel}).value = "Dec";
	createElement({tag: "option", text: "Hex", parent: bsel}).value = "Hex";	
	createElement({tag: 'button', text: 'Save', parent: modal, classes: ['btn', 'btn-modal']});
	document.body.append(overlay);
	overlay.onclick = function(event) {
		if(event.target.classList.contains("fixed-overlay") || event.target.classList.contains("btn-modal"))
			if(lsel.value && bsel.value)
				event.currentTarget.remove();
	};
	bsel.onchange = function(e) {		
		if(e.target.value == "Bin"){
			Array.prototype.slice.call(lsel.children).slice(2).forEach((el) => el.disabled = true);
			lsel.value = "2";
		}else
			Array.prototype.slice.call(lsel.children).slice(2).forEach((el) => el.disabled = false);
	};
}

createModal();