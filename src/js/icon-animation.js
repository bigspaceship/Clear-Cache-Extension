// (function(){
	/**
	 * Potential Animated Icon
	 */
	function IconAnimation(){
		
		var self		= this;
		
		var _width		= 19;
		var _height		= 19;
		var _canvas		= $("<canvas id='icon' width='"+_width+"' height='"+_height+"'></canvas>")[0];
		var _context	= _canvas.getContext('2d');
		
		var _imageA				= new Image();
		var _imageB				= new Image();
		var _imageAlpha			= 0;
		var _imageTargetAlpha	= 0;
		var _imateAlphaSpeed	= 1;
		var _imagesToLoad		= 2;
		
		var _timer;
		
		this.updated			= new signals.Signal();
		
		/**
		 * 
		 */
		function _init(){
			_timer = new Timer();
			_timer.updated.add( self.update, self );
			
			$([_imageA,_imageB]).load(function(){
				_imagesToLoad--;
				if(_imagesToLoad<=0){
					self.update();
				}
			});
			_imageA.src = "img/icon_19.png";
			_imageB.src = "img/icon_19_empty.png";
		}
		
		/**
		 * 
		 */
		this.getImageData = function(){
			return _context.getImageData(0,0,_width,_height);
		};
		
		/**
		 * 
		 */
		this.getCanvas = function(){
			return _canvas;
		};
		
		
		/**
		 * 
		 */
		this.update = function(){
			
			if( Math.abs(_imageAlpha-_imageTargetAlpha) < 0.01 ){
				_timer.stop();
				_imageAlpha = _imageTargetAlpha;
			}
			
			_context.clearRect( 0, 0, _width, _height );
			
			_context.drawImage( _imageA, 0, 0, _width, _height );
			
			var originalAlpha = _context.globalAlpha;
			_context.globalAlpha = _imageAlpha;
			
			_context.drawImage( _imageB, 0, 0, _width, _height );
			
			_context.globalAlpha = originalAlpha;
			_imageAlpha -= (_imageAlpha-_imageTargetAlpha) * _imateAlphaSpeed;
			
			self.updated.dispatch();
		};
		
		/**
		 * 
		 */
		this.fadeIn = function(){
			_imageTargetAlpha	= 1;
			_imateAlphaSpeed	= 0.25;
			self.update();
			_timer.start();
		};
		
		/**
		 * 
		 */
		this.fadeOut = function(){
			_imageTargetAlpha	= 0;
			_imateAlphaSpeed	= 0.05;
			self.update();
			_timer.start();
		};
		
		_init();
	}
	
	
	
	/**
	 * 
	 */
	function Timer( interval ){
		var self		= this;
		var _id			= NaN;
		var _interval	= interval || 1000/30;
		this.updated	= new signals.Signal();
		
		this.start = function(){
			// console.log("start",_interval);
			self.stop();
			_id = setInterval( function(){ self.updated.dispatch(); }, _interval );
		};
		
		this.stop = function(){
			if( !isNaN( _id ) ){
				clearInterval( _id );
				_id = NaN;
			}
		};
	}
	
// })();