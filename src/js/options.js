(function(){
	$(document).ready(function(){
		
		/**
		 * Default values set in load-default-options.js
		 */
		var timeperiod		= localStorage['timeperiod'];
		var dataToRemove	= JSON.parse(localStorage['data_to_remove']);
		var cookieSettings	= JSON.parse(localStorage['cookie_settings']);
		var autorefresh		= localStorage['autorefresh']=='true' || false;
		
		/**
		 * Hotfix: 'originBoundCertificates' is not supported any more
		 */
		if( dataToRemove['originBoundCertificates'] ){
			delete dataToRemove['originBoundCertificates'];
			saveSettings();
		}
		
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
		
		/**auto
		 * Parse autorefresh
		 */
		$("input[name='autorefresh']")
			.prop('checked', autorefresh==true)
			.change(function(){
				autorefresh = $(this).prop('checked');
				saveSettings();
			});
		
		
		
		
		/*=======================================================
		 * Cookie Settings
		 *=======================================================/
 		/**
 		 * Load sub-options instead of deeplinking
 		 */
 		 $("a.filters").click(function(event){
  			event.preventDefault();
 			var listItem	= $(this).parent("li");
 			var suboptions	= $("aside", listItem);
 			suboptions.slideToggle();
  			return false;
 		});
		
  		/**
  		 * Add new cookie filter
  		 */
  		 $("#cookie-filters a.add").click(function(event){
   			event.preventDefault();
			addCookieFilter( '', true );
   			return false;
  		});
		
   		/**
   		 * Remove cookie filter
   		 */
 		function removeCookieFilter( event ){
    		event.preventDefault();
    		var listItem = $(this).closest("li");
   			listItem.addClass("hidden");
			saveFilters();
   			listItem.closest("li").delay(200).slideUp(150, function(){
   				$(this).remove();
   			});
    		return false;
 		}
		
   		$("#cookie-filters a.remove").live( 'click', removeCookieFilter );
   		$("#cookie-filters a.remove").click( removeCookieFilter );
		
   		/**
   		 * Add cookie filter
   		 */
 		function addCookieFilter( value, focus ){
 			value = value || "";
  			var list		= $("#cookie-filters ol");
 			var listItem	= $('<li class="suboption hidden"><input type="text" value="'+value+'" placeholder="e.g. \'.domain.com\' or \'sub.domain.com\'" /><a href="#" class="remove">remove</a></li>');
 			list.append( listItem );
 			listItem.hide();
 			listItem.fadeIn( 100, function(){
				listItem.removeClass("hidden");
				if(focus){
					$("input",listItem).focus();
				}
 			});
 			return listItem;
 		}
		 
    	/**
    	 * Save cookie filters
    	 */
  		function saveFilters( event ){
  			var filters = [];
			
			$("#cookie-filters input[type='text']").each(function(){
				
				// skip filters that are being removed
				if($(this).closest("li").hasClass("hidden")){
					return;
				}
				
				var filter = this.value;
				
				if( !filter || filter=='' || filter.length<3 ){
					return;
				}
				
				if( !event || event.data.validate ){
					$(this).removeClass("error");
					
					var segments = filter.split(".");
					
					// error
					if( segments.length<=1 && filter!="localhost" ){
						$(this).addClass("error");
						return;
						
					// success
					} else {
						
						if( segments.length==2 && segments[1]!="local" ){
							filter = "."+filter;
						}
						
						this.value = filter;
					}
				}
				
				filters.push( filter );
			});
			
			cookieSettings.filters = filters;
			saveSettings();
  		}
		
  		$("#cookie-filters input[type='text']").live( 'blur', {"validate":true}, saveFilters );
  		$("#cookie-filters input[type='text']").live( 'change', {"validate":true}, saveFilters );
  		$("#cookie-filters input[type='text']").live( 'keyup', {"validate":false}, saveFilters );
		$("#cookies_filter_inclusive_yes, #cookies_filter_inclusive_no").change(function(){
			cookieSettings.inclusive = $("#cookies_filter_inclusive_yes").is(":checked");
			saveSettings();
		});
		 
		
		/*=======================================================
		 * Initialize
		 *=======================================================/
		 
		/**
		 * Init
		 */
		timeperiod = timeperiod || timeperiods[0];
		$("input[value='"+timeperiod+"']").prop('checked',true);
		
		$.each( cookieSettings.filters, function( index, value ){
			addCookieFilter( value );
		});
		
		if( cookieSettings.inclusive ){
			$("#cookies_filter_inclusive_yes").click();
		} else {
			$("#cookies_filter_inclusive_no").click();
		}
		
		/**
		 * Helpers
		 */
		function saveSettings(){
			localStorage['data_to_remove']	= JSON.stringify( dataToRemove );
			localStorage['timeperiod']		= timeperiod;
			localStorage['autorefresh']		= autorefresh;
			localStorage['cookie_settings']	= JSON.stringify( cookieSettings );
		}
		
		/**
		 * Based on http://daringfireball.net/2010/07/improved_regex_for_matching_urls
		 */
		function validateUrl( url ){
			var regex = /^(?:([a-z0-9+.-]+:\/\/)((?:(?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(:(?:\d*))?(\/(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?|([a-z0-9+.-]+:)(\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?)(\?(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?(#(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?$/i;
			return url.match( regex );
		}
	});
})();