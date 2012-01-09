(function(){
	$(document).ready(function(){
		
		/**
		 * Default values set in load-default-options.js
		 */
		var timeperiod		= localStorage['timeperiod'];
		var dataToRemove	= JSON.parse(localStorage['data_to_remove']);
		
		/**
		 * Parse time periods
		 */
		$("input[name='timeperiod']").each(function(){
			var element = $(this);
			var period = element.attr("value");
			element.prop('checked', period == timeperiod);
			element.change(function(){
				timeperiod = period;
				saveSettings();
			});
		});
		
		/**
		 * Parse data_to_remove
		 */
		$("input[name='data_to_remove']").each(function(){
			var element		= $(this);
			var dataType	= element.attr("value");
			element.prop('checked', dataToRemove[dataType]);
			element.change(function(){
				dataToRemove[dataType] = element.prop('checked');
				saveSettings();
			});
		});
		
		/**
		 * Use adjacent links to trigger input click
		 */
		$("input + a").click(function(event){
			event.preventDefault();
			$(this).prev().click();
			return false;
		});
		
		/**
		 * Init
		 */
		timeperiod = timeperiod || timeperiods[0];
		$("input[value='"+timeperiod+"']").prop('checked',true);
		
		/**
		 * Helpers
		 */
		function saveSettings(){
			localStorage['data_to_remove']	= JSON.stringify( dataToRemove );
			localStorage['timeperiod']		= timeperiod;
		}
	});
})();