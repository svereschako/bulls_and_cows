const bases = {
	Dec: "0123456789",
	Bin: "01",
	Oct: "01234567",
	Hex: "0123456789ABCDEF"
};

let length;
let base;
let secret;
const attempts = [];
const btns = createElement({parent: document.body, classes: ["btns"]});
const ngbtn = createElement({tag: "button", text: "New game", parent: btns, classes: ["btn"]});
const trbtn = createElement({tag: "button", text: "Records", parent: btns, classes: ["btn"]});

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
			if(lsel.value && bsel.value){
				length = Number(lsel.value);
				base = bsel.value;
				secret = generateSecret(length, base);
				render();
				event.currentTarget.remove();
				//console.log(secret)
			}
	};
	bsel.onchange = function(e) {		
		if(e.target.value == "Bin"){
			Array.prototype.slice.call(lsel.children).slice(2).forEach((el) => el.disabled = true);
			lsel.value = "2";
		}else
			Array.prototype.slice.call(lsel.children).slice(2).forEach((el) => el.disabled = false);
	};
}

function render() {
	const field = createElement({parent: document.body, classes: ["field"]});
	const input = createElement({tag: "input", parent: field, classes: ["attempt"]});
	const checkbtn = createElement({tag: "button", text: "Check", parent: field, classes: ["btn", "check-btn"]});
	const history = createElement({parent: field, classes: ["history"]});
	checkbtn.onclick = function() {
		if(input.value == "")
			return;
		if(!isValidGuess(input.value, length, base)){
			input.value = "Attempt value in not correct";
			input.style.color = "red";
			return;
		}		
		if(attempts.includes(input.value)){
			input.value = `Attempt ${input.value} has been already used`;
			return;
		}else
			attempts.push(input.value);
		const res = evaluateGuess(secret, input.value);
		const entry = createElement({text: `${input.value} Attempt result: Bulls ${res.bulls} Cows ${res.cows}`, parent: history, classes: ["entry"]});
		input.value = "";
		if(length == res.bulls){
			showInfo();
			console.log("game is over")
		}
	};
	input.onfocus = function(e) {
		if(e.target.value != "")
			e.target.value = "";
			e.target.style.color = "";
	};
}

function showInfo() {
	const overlay = createElement({classes: ['fixed-overlay']});
	const modal = createElement({parent: overlay, classes: ["modal-window"]});
	createElement({text: "Game is over", parent: modal, classes: ["info"]});
	createElement({tag: 'button', text: 'Ok', parent: modal, classes: ['btn', 'btn-modal']});
	document.body.append(overlay);
	overlay.onclick = function(event) {
		if(event.target.classList.contains("fixed-overlay") || event.target.classList.contains("btn-modal")){
			//field.value = "";
			//history.textContent = "";
			event.currentTarget.remove();
		}
	};
}

ngbtn.addEventListener("click", () => {
	history.textContent = "";
	createModal();
});
createModal();