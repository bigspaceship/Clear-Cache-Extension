(function(){
	
	var _iconAnimation = new IconAnimation();
	
	_iconAnimation.updated.add(function(){
		chrome.browserAction.setIcon({'imageData':_iconAnimation.getImageData()});
	});
	
	chrome.browserAction.onClicked.addListener(function(tab) {
		/**
		 * Default values set in load-default-options.js
		 */
		var dataToRemove	= JSON.parse( localStorage['data_to_remove'] );
		var cookieSettings	= JSON.parse( localStorage['cookie_settings'] );
		var timeperiod		= parseTimeperiod( localStorage['timeperiod'] );
		var timeout			= NaN;
		
		function clearCache(){
			
			_iconAnimation.fadeIn();
			
			chrome.experimental.clear.browsingData( timeperiod, dataToRemove, function(){
				
				startTimeout(function(){
					chrome.browserAction.setBadgeText({text:""});
					chrome.browserAction.setPopup({popup:""});
					_iconAnimation.fadeOut();
				}, 500 );
			});
		}
		
		function startTimeout( handler, delay ){
			stopTimeout();
			timeout = setTimeout( handler, delay );
		}
		
		function stopTimeout(){
			if(!isNaN(timeout)){
				return;
			}
			clearTimeout(timeout);
		}
		
		clearCache();
		
	});
	
	/**
	 * @param {string} timeperiod
	 * @return {number|string}
	 */
	function parseTimeperiod( timeperiod ){
		
		/* 
		 * Chrome updated the clear API with the following patch:
		 * http://codereview.chromium.org/8932015/
		 * Make sure that both versions are suppored by checking if
		 * the new features are supported since both versions use
		 * different timeperiod formats
		 */
		if( !chrome.experimental.clear['localStorage'] ){
			return timeperiod;
		}
		
		switch( timeperiod ){
			case "last_hour":	return (new Date()).getTime() - 1000 * 60 * 60;
			case "last_day":	return (new Date()).getTime() - 1000 * 60 * 60 * 24;
			case "last_week":	return (new Date()).getTime() - 1000 * 60 * 60 * 24 * 7;
			case "last_month":	return (new Date()).getTime() - 1000 * 60 * 60 * 24 * 7 * 4;
			case "everything":
			default:			return 0;
		}
		
	}
	
})();