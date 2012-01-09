(function(){
	
	var _iconAnimation = new IconAnimation();
	
	_iconAnimation.updated.add(function(){
		chrome.browserAction.setIcon({'imageData':_iconAnimation.getImageData()});
	});
	
	chrome.browserAction.onClicked.addListener(function(tab) {
		/**
		 * Default values set in load-default-options.js
		 */
		var timeperiod		= localStorage['timeperiod'];
		var dataToRemove	= JSON.parse( localStorage['data_to_remove'] );
		
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
})();