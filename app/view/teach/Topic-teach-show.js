Ext.define('Youngshine.view.teach.Topic-teach-show',{
	extend: 'Ext.Container',
	xtype: 'topic-teach-show',
	
	//requires: ['Ext.Img','Ext.ActionSheet'], 
	
	config: {
/*        showAnimation: {
            type: "slide",
            direction: "left",
            duration: 300
        },
        hideAnimation: {
            type: "slide",
            direction: "right",
            duration: 300
        }, */
		//layout: 'vbox',
		scrollable: true,
		
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '题目解答及评分', // 根据不同类型Type而变化，在updateRecord
			items: [{
				text: '返回',
				//iconCls: 'arrow_left',
        		//iconMask: true,
				ui: 'back',
				action: 'back',	
				handler: function(){
					//var view = Youngshine.app.getController('Teach').getTopicteach();
					//Ext.Viewport.setActiveItem(view);	
					//this.up('Container').destroy()
					//this.up('Container').onBack()
				}
            },{
            	xtype: 'spacer'	
        	},{
				//text: '移除',
				iconCls: 'trash',
				ui: 'decline',
				action: 'delete',					
			}]
		},{
			xtype: 'fieldset',
			items: [{
	            xtype: 'radiofield',
	            name : 'done',
	            value: '0',
	            label: '未做题',
	            //checked: true
	        },{
	            xtype: 'radiofield',
	            name : 'done',
	            value: '1',
	            label: '做错'
	        },{
	            xtype: 'radiofield',
	            name : 'done',
	            value: '2',
	            label: '解题后做对'
	        },{
	            xtype: 'radiofield',
	            name : 'done',
	            value: '3',
	            label: '做对'	
	        }]		
		},{			
			xtype: 'panel',
			//height: 100,
			itemId: 'topicInfo',
			tpl: [
				//'<div>帐号：{student_name}｛真实姓名：{realname}｝</div>',
				'<div style="color:orangered;">题目［{gid}］</div>',
				//'<div><img class=teach src="{pic_teach}" height=auto width=100% /></div>',
				'<div>{content}</div>',
				//'<div style="text-align:center;">难度：{fullLevel}</div>',
				//'</div>',	

				
				'<div><hr></div>',
				
				'<div style="color:orangered;">答案</div>',
				'<div>{answer}</div>',
				//'<div><img class=answer src="{pic_teach_answer}" height=auto width=100% /></div>', //高度自动，宽度自动 height="100%" auto
				
				].join(''),
			//margin: '0 0 0 0',
			styleHtmlContent: true,
			style: {
				backgroundColor: '#fff',
				color: '#000',
				//padding: 15
			},

		}],
		
		record: null, //container保存数据记录setRecord
		
		listeners: [{
			delegate: 'button[action=delete]',
			event: 'tap',
			fn: 'onDelete'
		},{
			delegate: 'button[action=done]',
			event: 'tap',
			fn: 'onDone'
		},{
			delegate: 'button[action=back]',
			event: 'tap',
			fn: 'onBack'
		},{
			delegate: 'radiofield',
			event: 'check',
			fn: 'onDone'	
		},{
			element: 'element', 
			event: 'tap',
			delegate: 'img', // 聊天内容对方头像，单击显示个人信息
			fn: 'onZoom'
		}]
	},
	
	// setRecord lead to this，更新页面显示
	updateRecord: function(newRecord){
		var me = this;
		//alert(newRecord); // 有时控制器setrecord(record)，这个函数不运行？
		if(newRecord){
			console.log(newRecord.data);
			this.down('panel[itemId=topicInfo]').setData(newRecord.data);
			//
			var radioChecked = this.down('radiofield[value='+newRecord.data.done+']')
			radioChecked.setChecked(true)
			
			// 评分后，不能删除
			me.setBtnDelete(newRecord.data.done)
		}
	},	
	
	onDelete: function(){
		var me = this;
		//list.select(index,true); // 高亮当前记录
		var actionSheet = Ext.create('Ext.ActionSheet', {
			items: [{
				text: '移除不合适题目',
				ui: 'decline',
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					me.fireEvent('del', me.getRecord(),me);
					//window.location ='tel:xxxxxxx';
					//window.location = 'tel:' + phone;
				}
			},{
				text: '取消',
				scope: this,
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					//list.deselect(index); // cancel高亮当前记录
				}
			}]
		});
		Ext.Viewport.add(actionSheet);
		actionSheet.show();	
	},
	onDone: function(radio){
		var me = this; 
		//console.log(radio.getValue())
		var done = radio.getValue(),
			fullDone = radio.getLabel()
		me.setBtnDelete(done); // 评分（！＝0）不能删除
		me.fireEvent('done',done,fullDone,me.getRecord(), me);
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

	onBack: function(){
		var me = this;
		/*
		var view = Youngshine.app.getController('Teach').getTopicteach();
		view.setShowAnimation(false); 
		// 关闭实例的show动画，避免和当前页面hide交叉
		Ext.Viewport.setActiveItem(view);	
		me.hide();
		setTimeout(function(){ //延迟，才能hide config动画，滚动到最后4-1
			me.destroy();
		},300);	*/
		me.fireEvent('back', me);
	},
	
    //use initialize method to swipe back 右滑返回
    initialize : function() {
        this.callParent();
        this.element.on({
            scope : this,
            swipe : 'onElSwipe' //not use anonymous functions
        });
    },   
    onElSwipe : function(e) {
        console.log(e.target)
		var me = this;
		//if(e.target.className != "prodinfo") // 滑动商品名称等panel才退回
		//	return
		if(e.direction=='right'){
        	//Ext.Viewport.setActiveItem( Youngshine.app.getController('Teach').getTopicteach() );
			//this.destroy();
			me.onBack();
        };     
    }, 
	
	setBtnDelete: function(done){
		this.down('button[action=delete]').setHidden(done!=0)
	},	
});