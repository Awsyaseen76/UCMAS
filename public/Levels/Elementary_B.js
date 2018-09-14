var UCMAS = {
		levels: {
			"Elementary_B": {
				"Book_A": {
						"pages":{
								'1': ["63*4*29/1/2", "25+79-8+4-30+16", "48+6+50+3+21+79", "75-34+9-12+60+8", "19+52+7+4+86+30", "36+80-2+9-51+47", "52+4+98+60+7+31", "87-3+14-29+6+50", "64+1+79+30+8+25", "90-7+4-53+18+62", "15+9+8+76+32+40", "42-3+6+90-57+81", "18+60+7+45+9+23", "72+9-40+8-31+65", "65+8+74+10+3+29", "93-6+28-51+7+40", "12+30+5+6+48+79", "84+9-7+51-20+63", "60+5+97+13+8+42", "24-8+59-30+7+16"]
						}
				}
			}
		}
	};





// console.log(UCMAS.pages['1'][0].split(/([\*/+-])+/));

// var arr = UCMAS.pages['1'][0].split(/([\+-])+/);

// console.log(arr)

// var result = 0;
// var results = [];

// for (var j in UCMAS.levels.Elementary_B.Book_A.pages['1']){
// 	var equation = calculator(UCMAS.levels.Elementary_B.Book_A.pages['1'][j]);
// 	console.log(equation);

// 	// results.push(calculator(equation));
// }


// function asyncLoop(i, cb) {
// 	    if (i < UCMAS.levels.Elementary_B.Book_A.pages['1'].length) {
// 			var equation = calculator(UCMAS.levels.Elementary_B.Book_A.pages['1'][i]);
// 			results.push(equation);
// 			asyncLoop(i+1, cb);
// 	    } else {
// 	        cb();
// 	    }
// 	}
// 	asyncLoop(0, function() {
// 	    console.log('the result: ',results);
// 	});



// console.log(results);


function calculator(arr){
	var results = [];
	// var arr = str.split(/([\*/+-])+/);
	function asyncLoop(i, cb) {
		if (i < arr.length) {
			var eq = arr[i].split(/([\*/+-])+/);
			hasMultAndDiv(eq, function(result){
				results.push(result);
			});
		asyncLoop(i+1, cb);
	    } else {
	        cb();
	    }
	}
	asyncLoop(0, function() {
	    console.log('the results: ',results);
	});
}



function hasMultAndDiv(arr, callback){
	var index, mult, div;
	// if there is * or /	// 
	if(arr.indexOf('*')>-1 || arr.indexOf('/')>-1){
		// if there is * and /
		if(arr.indexOf('*')>-1 && arr.indexOf('/')>-1){
			if(arr.indexOf('*') < arr.indexOf('/')){
				index = arr.indexOf('*')-1;
				mult = arr.splice(arr.indexOf('*')-1, 3);
				arr.splice(index, 0, mult[0]*mult[2]);
				// console.log(arr);
			}else if (arr.indexOf('/') < arr.indexOf('*')) {
				index = arr.indexOf('/')-1;
				div = arr.splice(arr.indexOf('/')-1, 3);
				arr.splice(index, 0, div[0]/div[2]);
				// console.log(arr);
			}
		}else if (arr.indexOf('*')>-1 && arr.indexOf('/')==-1) {
			index = arr.indexOf('*')-1;
			mult = arr.splice(arr.indexOf('*')-1, 3);
			arr.splice(index, 0, mult[0]*mult[2]);
			// console.log(arr);
		}else if (arr.indexOf('/')>-1 && arr.indexOf('*')==-1) {
			index = arr.indexOf('/')-1;
			div = arr.splice(arr.indexOf('/')-1, 3);
			arr.splice(index, 0, div[0]/div[2]);
			// console.log(arr);
		}
	}else{
		// return hasSumAndSub(arr);
		var total = Number(arr[0]);
		for(var i=1; i<arr.length; i++){
			if(arr[i]=='+'){
				total+=Number(arr[i+1]);
			}else if(arr[i]=='-'){
				total-=Number(arr[i+1]);
			}
		}
		// console.log('total is: ',total);
		// console.log('the callback is: ',callback);
		if(callback){
			return callback(total);
		}
		// return total;
	}
	hasMultAndDiv(arr, callback);
}


// function hasSumAndSub(arr){
// 	var total = Number(arr[0]);
// 	for(var i=1; i<arr.length; i++){
// 		if(arr[i]=='+'){
// 			total+=Number(arr[i+1]);
// 		}else if(arr[i]=='-'){
// 			total-=Number(arr[i+1]);
// 		}
// 	}
// 	console.log('total is: ',total);
// 	return total;
// }


// calculator("63+18*3/6-1*43-23/12+7*4/2*2+57-2+8/4+20");
calculator(UCMAS.levels.Elementary_B.Book_A.pages['1']);

