// 公用类，图片缩放
Ext.define('Youngshine.view.teach.ImageViewer',{
	extend: 'Ext.Container',
	xtype: 'imageviewer',
	
    config: {
        doubleTapScale: 1,
        maxScale: 4,
        loadingMask: true,
        previewSrc: false,
        resizeOnLoad:true,
        imageSrc: false,
        initOnActivate: false,
        cls: 'imageBox',
        scrollable: 'both',
        html: '<figure><img></figure>'
    },
    
    initialize: function() {
        if(this.initOnActivate)
            this.addListener('activate', this.initViewer, this, {delay: 10, single: true});
        else
            this.addListener('painted', this.initViewer, this, {delay: 10, single: true});        
    },
    
    initViewer: function() {
        
        //disable scroller
        var scroller = this.getScrollable().getScroller();
        scroller.setDisabled(true);
        
        // mask image viewer
        if(this.getLoadingMask())
            this.setMasked({
                xtype: 'loadmask',
            });


        // retrieve DOM els
        this.figEl = this.element.down('figure');
        this.imgEl = this.figEl.down('img');


        // apply required styles
        this.figEl.setStyle({
            overflow: 'hidden',
            display: 'block',
            margin: 0
        });

        this.imgEl.setStyle({
            '-webkit-user-drag': 'none',
            '-webkit-transform-origin': '0 0',
            'visibility': 'hidden'
        });


        // show preview
        if(this.getPreviewSrc())
        {
            this.element.setStyle({
                backgroundImage: 'url('+this.getPreviewSrc()+')',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                webkitBackgroundSize: 'contain'
            });
        }


        // attach event listeners
        this.on('load', this.onImageLoad, this);
        this.imgEl.addListener({
            scope: this,
            doubletap: this.onDoubleTap,
            pinchstart: this.onImagePinchStart,
            pinch: this.onImagePinch,
            pinchend: this.onImagePinchEnd
        });    


        // load image
        if(this.getImageSrc())
            this.loadImage(this.getImageSrc());
    },
    
    loadImage: function(src) {    
        if(this.imgEl){
            this.imgEl.dom.src = src;
            this.imgEl.dom.onload = Ext.Function.bind(this.onLoad, this, this.imgEl, 0);
        }
        else
            this.getImageSrc() = src;
    },
    
    onLoad : function(el, e) {
        this.fireEvent('load', this, el, e);
    },
    
    onImageLoad: function() {
        // get viewport size
        this.viewportWidth = this.viewportWidth || this.getWidth() || this.parent.element.getWidth();
        this.viewportHeight = this.viewportHeight || this.getHeight() || this.parent.element.getHeight();
            
        // grab image size
        this.imgWidth = this.imgEl.dom.width
        this.imgHeight = this.imgEl.dom.height;
                
        // calculate and apply initial scale to fit image to screen
        if(this.getResizeOnLoad()){
            this.scale = this.baseScale = Math.min(this.viewportWidth/this.imgWidth, this.viewportHeight/this.imgHeight);
            this.setMaxScale(this.scale*4);
        }else{
            this.scale = this.baseScale = 1;
        }
        
        // set initial translation to center
        this.translateX = this.translateBaseX = (this.viewportWidth - this.baseScale * this.imgWidth) / 2;
        this.translateY = this.translateBaseY = (this.viewportHeight - this.baseScale * this.imgHeight) / 2;
        
        // apply initial scale and translation
        this.applyTransform();
        
        // initialize scroller configuration
        this.adjustScroller();


        // show image and remove mask
        this.imgEl.setStyle({ visibility: 'visible' });


        // remove preview
        if(this.getPreviewSrc())
        {
            this.element.setStyle({
                backgroundImage: 'none'
            });
        }


        if(this.getLoadingMask())
            this.setMasked(false);


        this.fireEvent('imageLoaded', this);
    },
    
    onImagePinchStart: function(ev) {
        var scroller = this.getScrollable().getScroller();


        // disable scrolling during pinch
        scroller.stopAnimation();
        scroller.setDisabled(true);
        
        // store beginning scale
        this.startScale = this.scale;
        
        // calculate touch midpoint relative to image viewport
        this.originViewportX = (ev.touches[0].pageX + ev.touches[1].pageX) / 2 - this.element.getX();
        this.originViewportY = (ev.touches[0].pageY + ev.touches[1].pageY) / 2 - this.element.getY();
        
        // translate viewport origin to position on scaled image
        this.originScaledImgX = this.originViewportX + scroller.position.x - this.translateX;
        this.originScaledImgY = this.originViewportY + scroller.position.y - this.translateY;
        
        // unscale to find origin on full size image
        this.originFullImgX = this.originScaledImgX / this.scale;
        this.originFullImgY = this.originScaledImgY / this.scale;
        
        // calculate translation needed to counteract new origin and keep image in same position on screen
        this.translateX += (-1 * ((this.imgWidth*(1-this.scale)) * (this.originFullImgX/this.imgWidth)));
        this.translateY += (-1 * ((this.imgHeight*(1-this.scale)) * (this.originFullImgY/this.imgHeight)))
    
        // apply new origin
        this.setOrigin(this.originFullImgX, this.originFullImgY);
    
        // apply translate and scale CSS
        this.applyTransform();
    },
    
    onImagePinch: function(ev) {
        // prevent scaling to smaller than screen size
        this.scale = Ext.Number.constrain(ev.scale * this.startScale, this.baseScale-2, this.getMaxScale());
        this.applyTransform();
    },
    
    onImagePinchEnd: function(ev) {
        
        // set new translation
        if(this.scale == this.baseScale)
        {
            // move to center
            this.setTranslation(this.translateBaseX, this.translateBaseY);
        }
        else
        {    
            //Resize to init size like ios
            if(this.scale < this.baseScale && this.getResizeOnLoad()){
                this.resetZoom();
                return;
            }
            // calculate rescaled origin
            this.originReScaledImgX = this.originScaledImgX * (this.scale / this.startScale);
            this.originReScaledImgY = this.originScaledImgY * (this.scale / this.startScale);
            
            // maintain zoom position
            this.setTranslation(this.originViewportX - this.originReScaledImgX, this.originViewportY - this.originReScaledImgY);            
        }
        // reset origin and update transform with new translation
        this.setOrigin(0, 0);
        this.applyTransform();


        // adjust scroll container
        this.adjustScroller();
    },
    
    onDoubleTap: function(ev, t) {
        var that = this;
        var scroller = this.getScrollable().getScroller();
        if(!this.getDoubleTapScale())
            return false;
        
        // set scale and translation
        if(this.scale > this.baseScale)
        {
            // zoom out to base view
            this.scale = this.baseScale;
            this.setTranslation(this.translateBaseX, this.translateBaseY);
            // reset origin and update transform with new translation
            this.applyTransform();


            // adjust scroll container
            this.adjustScroller();
            
            // force repaint to solve occasional iOS rendering delay
            Ext.repaint();
        }
        else
        {
            // zoom in toward tap position
            var oldScale = this.scale,
            newScale = this.baseScale*4,
            originViewportX = ev ? (ev.pageX - this.element.getX()) : 0,
            originViewportY = ev ? (ev.pageY - this.element.getY()) : 0,
            originScaledImgX = originViewportX + scroller.position.x - this.translateX,
            originScaledImgY = originViewportY + scroller.position.y - this.translateY,
            originReScaledImgX = originScaledImgX * (newScale / oldScale),
            originReScaledImgY = originScaledImgY * (newScale / oldScale);
            
            this.scale = newScale;
            
            //smoothes the transition
            setTimeout(function(){
                that.setTranslation(originViewportX - originReScaledImgX, originViewportY - originReScaledImgY);
                // reset origin and update transform with new translation
                that.applyTransform();


                // adjust scroll container
                that.adjustScroller();
                
                // force repaint to solve occasional iOS rendering delay
                Ext.repaint();
            },50)
            
        }
            
        
    },
    
    setOrigin: function(x, y) {
        this.imgEl.dom.style.webkitTransformOrigin = x+'px '+y+'px';
    },
    
    setTranslation:  function(translateX, translateY) {
        this.translateX = translateX;
        this.translateY = translateY;
            
        // transfer negative translations to scroll offset
        this.scrollX = this.scrollY = 0;
        
        if(this.translateX < 0)
        {
            this.scrollX = this.translateX;
            this.translateX = 0;
        }
        if(this.translateY < 0)
        {
            this.scrollY = this.translateY;
            this.translateY = 0;
        }
    },
    
    resetZoom:function(){
        //Resize to init size like ios
        this.scale = this.baseScale;
        
        this.setTranslation(this.translateBaseX, this.translateBaseY);
        
        // reset origin and update transform with new translation
        this.setOrigin(0, 0);
        this.applyTransform();


        // adjust scroll container
        this.adjustScroller();
        
    },
    
    resize:function(){
        // get viewport size
        this.viewportWidth = this.parent.element.getWidth() ||this.viewportWidth || this.getWidth();
        this.viewportHeight = this.parent.element.getHeight() || this.viewportHeight || this.getHeight();

//前面已经有的，不起作用？？？？initview
this.figEl = this.element.down('figure');
this.imgEl = this.figEl.down('img');
        // grab image size
        this.imgWidth = this.imgEl.dom.width
        this.imgHeight = this.imgEl.dom.height;
                
        // calculate and apply initial scale to fit image to screen
        if(this.getResizeOnLoad()){
            this.scale = this.baseScale = Math.min(this.viewportWidth/this.imgWidth, this.viewportHeight/this.imgHeight);
            this.setMaxScale(this.scale*4);
        }else{
            this.scale = this.baseScale = 1;
        }
        
        // set initial translation to center
        this.translateX = this.translateBaseX = (this.viewportWidth - this.baseScale * this.imgWidth) / 2;
        this.translateY = this.translateBaseY = (this.viewportHeight - this.baseScale * this.imgHeight) / 2;
        
        // apply initial scale and translation
        this.applyTransform();
        
        // initialize scroller configuration
        this.adjustScroller();
         
    },
    
    applyTransform: function() {
        var fixedX = Ext.Number.toFixed(this.translateX,5),
        	fixedY = Ext.Number.toFixed(this.translateY,5),
        	fixedScale = Ext.Number.toFixed(this.scale, 8);
        
        if(Ext.os.is.Android)
        {
            this.imgEl.dom.style.webkitTransform = 
                //'translate('+fixedX+'px, '+fixedY+'px)'
                //+' scale('+fixedScale+','+fixedScale+')';
                'matrix('+fixedScale+',0,0,'+fixedScale+','+fixedX+','+fixedY+')'
        }
        else
        {
            this.imgEl.dom.style.webkitTransform =
                'translate3d('+fixedX+'px, '+fixedY+'px, 0)'
                +' scale3d('+fixedScale+','+fixedScale+',1)';
        }
    },
    
    adjustScroller: function() {
        var scroller = this.getScrollable().getScroller();    
        
        // disable scrolling if zoomed out completely, else enable it
        if(this.scale == this.baseScale)
            scroller.setDisabled(true);
        else
            scroller.setDisabled(false);
        
        // size container to final image size
        var boundWidth = Math.max(this.imgWidth * this.scale, this.viewportWidth);
        var boundHeight = Math.max(this.imgHeight * this.scale, this.viewportHeight);


        this.figEl.setStyle({
            width: boundWidth + 'px',
            height: boundHeight + 'px'
        });
        
        // update scroller to new content size
        scroller.refresh();


        // apply scroll
        var x = 0;
        if(this.scrollX){
            x = this.scrollX
        }
        var y = 0;
        if(this.scrollY){
            y = this.scrollY
        }
        scroller.scrollTo(x*-1,y*-1)
    }        
});