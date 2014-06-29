define(['underscore'], function(_){
	function padWith0(str){
		return str[1] ? str : "0" + str[0]; // padding
	}
	function date2ISO(date){
		if(_.isDate(date)){
			var mm = padWith0((date.getMonth() + 1).toString()); // getMonth() is zero-based
			var dd = padWith0(date.getDate().toString());
			return [date.getFullYear().toString(), mm, dd].join('-');
		}
		return '';
	}
	function time2ISO(date){
		if(_.isDate(date)){
		    var hh = padWith0(date.getHours().toString());
		    var mins = padWith0(date.getMinutes().toString());
		    var ss = padWith0(date.getSeconds().toString());
		    return [hh, mins, ss].join(':');
		}
		return '';
	}
	return {
		date2ISO : date2ISO,
		time2ISO : time2ISO,
		datetime2ISO : function(date){
			return [date2ISO(date),time2ISO(date)].join('T');
		}
	};
});