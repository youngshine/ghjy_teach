Ext.define('Youngshine.view.teach.Topic-teach-photos', {
    extend: 'Ext.Container',
	xtype: 'topic-teach-photos',
	
    config: {
        showAnimation: {
            type: "pop",
            //direction: "left",
            duration: 100
        },
		
		layout: 'vbox',
		oldView: '', //父view
		record: null,
		
        items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '教学笔记拍照上传',
			items: [{
				ui : 'back',
				action: 'back',
				text : '返回',
				handler: function(btn){
					//var view = Youngshine.app.getController('Teach').getStudent();
					//Ext.Viewport.add(view);	
					
					var oldView = btn.up('topic-teach-photos').getOldView(); //.xtype
					console.log(oldView)
					Ext.Viewport.setActiveItem(oldView)
					btn.up('topic-teach-photos').destroy() //返回
				},
				scope: this
/*			},{
				xtype: 'spacer'
			},{	
				ui: 'action',
				hidden: true,
				text: '＋添加',
				handler: function(btn){
					btn.up('topic-teach-photos').onShoot() //返回
				},
				scope: this	*/
			}]	
/*		},{	
            xtype: 'dataview',
            scrollable: true,
            inline: true,
            cls: 'dataview-inline',
            itemTpl: '<div class="img" style="background-image: url({photo});"></div>',
            store: 'Topic-teach'
			*/
		},{
			xtype: 'component',
			width: 70, height: 50,
			html: [ //上传fileinput透明不可见，可以点击
				'<div>＋</div>',
				'<input type="file" capture="camera" accept="image/*" ',
					'style="opacity:0;filter:alpha(opacity=0);top:-2px;right:-2px;font-size:1000px;position:absolute;" ',
				'/>'
			].join(''),
			style: { //文字
				"margin": "10px auto",
				"border": "1px solid #888",
				"border-radius": "5px",
				//"background-image": "linear-gradient(#1676b9,#10598d)",
				"text-align": "center",
				"font-size": '2.5em',
				"color": "#888"
			}	
			
		},{
			hidden: true,
			xtype: "fileinput",
            accept: "image/jpeg",
			capture: "camera",
			id: 'fileinputTeach',
			fieldLabel: '上传照片', 
			height: 45
		},{
			hidden: true,
			xtype:"image",
            height: 300,
            width: 300,
            style: {
                "background-position": "0 0"
            },
            src: 'http://placehold.it/300x300'
		},{
			xtype: 'list',
			store: 'Study-photos',
			grouped: true,
			//disableSelection: true,
			//height: 500,
			flex: 1,
			itemTpl: //'<div><span style="color:#888;">{fullCreated}</span>' + 
				//'<span class="removeItem" style="color:red;float:right;">－移除</span></div>'+
			'<div><img class=teach src="{photo}" height=80 width=auto /></div>' 		
        }],
		
		listeners: [{
			delegate: 'list',
			event: 'itemswipe',
			fn: 'onItemswipe'
		},{
			delegate: 'button[action=delete]',
			event: 'tap',
			fn: 'onDelete'
		},{
			element: 'element', 
			event: 'tap',
			delegate: 'img', // 聊天内容对方头像，单击显示个人信息
			fn: 'onZoom'
		},{
			element: 'element', 
			event: 'tap',
			delegate: 'span.removeItem', // 聊天内容对方头像，单击显示个人信息
			fn: 'onRemoveItem'
		}]
    },
	
	initialize: function(){
		this.callParent(arguments);
		
		this.file = this.element.down("input[type=file]");
		this.img = this.element.down('img')
		this.file.on("change",this.setPhoto, this)
		
		// fix for webkit
		window.URL = window.URL || window.webkitURL;
	},
	
	setPhoto: function(e){
		var me = this;
		var files = e.target.files; 
		console.log(files[0])
		if(files.length === 0  ){
			return
		}
		//if (!/\/(?:jpegpnggif)/i.test(file.type)) return;
		if(files[0].type.indexOf("image/jpeg") < 0 ){
			Ext.Msg.alert('照片格式不是JPG');
			return false
		}
			
		if(files.length === 1 && files[0].type.indexOf("image/jpeg") === 0 ){
			//if (!/\/(?:jpegpnggif)/i.test(file.type)) return;
			
			/* 1、jpg太大就压缩 2、上传uploadPhoto
			var photo = document.getElementById('myphoto');
            var reader = new FileReader();
            reader.onload = function(evt){
				//var result = this.result;
				//var img = new Image();
				//img.src = result;
				var result = evt.target.result; 
				console.log(result) 				 
				//photo.src = evt.target.result; 
				//如果图片大小小于200kb，则直接上传
                 if (result.length > 200) {
                     //img = null;
                     //upload(result, file.type, $(li));
 					//me.uploadPhoto(files[0])
		 			Ext.Msg.alert('照片大雨500K');
		 			return false
                 }else{
                 	me.uploadPhoto(files[0])
                 }
			} */
            //reader.readAsDataURL(file.files[0]);
			//photofile = file.value;	
			
			//如果图片大小小于200kb，则直接上传
			if (files[0].size > (500*1024)) {
				Ext.Msg.alert('照片大于500K');
				return false
			}else{
				me.uploadPhoto(files[0])
			}
			
			// 2.上传
			//me.uploadPhoto(files[0])
			/* this.img.setStyle("display","block");
			this.img.set({
				src: URL.createObjectURL(files[9])
			}) */
			//this.setCaptured(true)
		}else{
			//图片格式不是jpg
		}
	},
	//  上传图片以及保存到数据库
	uploadPhoto: function(file){
		var me = this;
		var xhr = new XMLHttpRequest();
		//var fd = new FormData(document.getElementById('fileupload'));
		var fd = new FormData();
		
		fd.append("studentstudyID", me.getRecord().data.studentstudyID);
		//fd.append("title", title);
		
		//fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
		fd.append("fileToUpload", file);
		
		fd.append("do", "submit");
		
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在上传照片'});
		xhr.open("POST", Youngshine.app.getApplication().dataUrl +"upload-photo.php");
		xhr.send(fd);
		xhr.onload = function(e) {
			if (this.status == 200) {
				Ext.Viewport.setMasked(false)
				console.log(this.responseText);
				//JSON
				var obj = JSON.parse(this.responseText)
				obj.created = new Date();
				//var now = new Date();
				//obj.fullCreated = now.getMonth()+1+'月' + now.getDate() + '日'
				Ext.getStore('Study-photos').insert(0,obj)
				//Ext.getStore('Study-photos').load(); // 因为有group，所以重新加载？？？
			}	
		} 
	},

	onItemswipe: function(list, index, target, record, e, eOpts){
		console.log(e)
		if(e.direction !== 'left') return false
			
		var me = this;
		list.select(index,true); // 高亮当前记录
		var actionSheet = Ext.create('Ext.ActionSheet', {
			items: [{
				text: '移除当前行照片',
				ui: 'decline',
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					me.fireEvent('del', record);
					//window.location ='tel:xxxxxxx';
					//window.location = 'tel:' + phone;
				}
			},{
				text: '取消',
				scope: this,
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					list.deselect(index); // cancel高亮当前记录
				}
			}]
		});
		Ext.Viewport.add(actionSheet);
		actionSheet.show();	
	},	
	onZoom: function(e){
		console.log(e.getTarget('img').complete)
		var isLoaded = e.getTarget('img').complete;
		if(!isLoaded)
			return false

		var zoom = Ext.create('Youngshine.view.teach.Zoom');
		zoom.down('imageviewer').setImageSrc(e.target.src);
		Ext.Viewport.setActiveItem(zoom);
	},	
	
});