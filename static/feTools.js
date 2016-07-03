  

/////////////////////////// number Protos ////////////////////////
Number.prototype.round = function(x){
	var y;
	if(x){
	  y = Math.pow(10,x)
	}else{
	  y = 100
	}
	return Math.round(this*y)/y
}

function round(number,x){
	var y;
	if(x){
	  y = Math.pow(10,x)
	}else{
	  y = 100
	}
	return Math.round(number*y)/y
};

Number.prototype.isInterval = function(interval,offset){
	var num = this;
	if(offset){
		num = offset + this;
	}
	var div = (num/interval)
	return  div == Math.round(div)
}

/////////////////////////// String Protos ////////////////////////

String.prototype.capital =  function () {
	var aString = this.split(" ");
	var Outter = [];
	for (i = 0; i < aString.length; i++){
	  var upper = aString[i].charAt(0).toUpperCase() + aString[i].slice(1);
	  Outter.push(upper);
	}
	var Word = Outter.join(" ");
	return Word;
}

String.prototype.replaceAll = function(search, replacement,searchType) {
    if(!searchType){searchType = 'g'}
    var target = this;
    return target.replace(new RegExp(search, searchType), replacement);
};