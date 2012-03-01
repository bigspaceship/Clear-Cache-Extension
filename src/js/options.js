(function(){
	$(document).ready(function(){
		
		/**
		 * Default values set in load-default-options.js
		 */
		var timeperiod		= localStorage['timeperiod'];
		var dataToRemove	= JSON.parse(localStorage['data_to_remove']);
		var cookieSettings	= JSON.parse(localStorage['cookie_settings']);
		
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
		/*$("input + a").click(function(event){
			event.preventDefault();
			$(this).prev().click();
			return false;
		});*/
		
		
		
		
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
   			$(this).parent("li").addClass("hidden").delay(200).slideUp(150, function(){
   				$(this).remove();
				saveFilters();
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
			
			if( !event || !event.data ){
				return;
			}
			
			$("#cookie-filters input[type='text']").each(function(){
				
				var filter = this.value;
				
				if( !filter || filter=='' || filter.length==0 ){
					return;
				}
				
				if( event.data.validate ){
					$(this).removeClass("error");
					
					var numSegments = getNumDomainSegments( filter );
					
					// e.g. ".com" or "domain."
					if( numSegments < 2 ){
						$(this).addClass("error");
						return;
						
					// add "." to something like "google.com"
					} else if( filter.indexOf(".")!=0 && numSegments <= 2 ){
						filter = "." + filter;
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
			localStorage['cookie_settings']	= JSON.stringify( cookieSettings );
		}
		function getNumDomainSegments( domain ){
			var numSegments = 0;
			var length = domain.length;
			if( domain.length > 0 ){
				numSegments = 1;
			}
			for(var i=0; i<length; i++){
				var current = domain.charAt(i);
				
				if( current=='/' || current=='?' || current=='#'){
					break;
				}
				
				if(  i>0 && i<length-1 && current=='.' && last!='.' && domain.charAt(i+1)!='.' ){
					numSegments++;
				}
				var last = current;
			}
			return numSegments;
		}
	});
})();