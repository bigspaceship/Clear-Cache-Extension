(function(){
	localStorage['timeperiod']		= localStorage['timeperiod'] || "last_hour";
	localStorage['data_to_remove']	= localStorage['data_to_remove'] || JSON.stringify({"cache":true});
	localStorage['cookie_settings']	= localStorage['cookie_settings']  || JSON.stringify({"inclusive":true,"filters":[]});
})();