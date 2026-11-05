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
	console.log(res)
	return {bulls: bsum, cows: csum};
}

