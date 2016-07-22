Ext.define('Youngshine.view.teach.Topic-teach-test',{
	extend: 'Ext.Container',
	xtype: 'topic-teach-test',
	
	//requires: ['Ext.Img','Ext.ActionSheet'], 
	
	config: {
        /*
		showAnimation: {
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
		
		//oldView: '', //父view
		record: null,
		
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '教学考试题', // 根据不同类型Type而变化，在updateRecord
			items: [{
				text: '返回',
				//iconCls: 'arrow_left',
        		//iconMask: true,
				ui: 'back',
				action: 'back',	
            },{
            	xtype: 'spacer'	
        	},{
				text: '出题',
				//iconCls: 'trash',
				ui: 'action',
				action: 'fetch',	
				handler: function(btn){
					this.up('topic-teach-test').onFetch(btn)
				}				
			}]
		},{
			xtype: 'label',
			docked: 'top',
			scrollDock: 'top',
			html: '知识点',
			itemId: 'zsd',
			style: 'text-align:center;color:#888;font-size:0.9em;margin:5px;'	
	
		},{			
			xtype: 'panel',
			//height: 100,
			itemId: 'topicInfo',
			tpl: [
				//'<div>帐号：{student_name}｛真实姓名：{realname}｝</div>',
				//'<div style="color:orangered;">题目［{gid}］</div>',
				//'<div><img class=teach src="{pic_teach}" height=auto width=100% /></div>',
				'<div>{content}</div>'
				//'<div style="text-align:center;">难度：{fullLevel}</div>',
				//'</div>',	

				
				//'<div><hr></div>',
				
				//'<div style="color:orangered;">答案</div>',
				//'<div>{answer}</div>',
				//'<div><img class=answer src="{pic_teach_answer}" height=auto width=100% /></div>', //高度自动，宽度自动 height="100%" auto
				
				].join(''),
			//margin: '0 0 0 0',
			styleHtmlContent: true,
			style: {
				//backgroundColor: '#fff',
				//color: '#000',
				//padding: 15
			},

		},{
    		xtype: 'button',
    		ui: 'confirm',
			//scrollDock: 'bottom',
			//docked: 'bottom',
			text: '结果评判',
			style: {
				//color: '#fff',
				//background: '#66cc00',
				//border: '1px solid #9d9d9d'
				margin: '10px auto',
				maxWidth: '470px'
			},
			action: 'pass',
			hidden: true,
			handler: function(){
				this.up('topic-teach-test').onPass()
			}
		}],
		
		record: null, //container保存数据记录setRecord
		
		listeners: [{
			delegate: 'button[action=back]',
			event: 'tap',
			fn: 'onBack'
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
			//var radioChecked = this.down('radiofield[value='+newRecord.data.done+']')
			//radioChecked.setChecked(true)
			
			// 评分后，不能删除
			//me.setBtnDelete(newRecord.data.done)
		}
	},	

	// 根据学生level？？最低难度1，出考试题
	onFetch: function(btn){
		var me = this;
		//btn.setDisabled(true)
		
    	Ext.Msg.confirm('出题',"随机抽取考题？",function(btn){	
			if(btn == 'yes'){
				var obj = {
					"level": 1, //level,//考试题目用最忌难度 1 (2,3)
					"zsdID": me.getRecord().data.zsdID, //知识点分三个学科表id不唯一
					"subjectID": me.getRecord().data.subjectID,//知识点按学科分表
					"studentstudyID": me.getRecord().data.studentstudyID,
				}	
				console.log(obj)
				// 随机出考题 1个
				me.fireEvent('fetchTopicTest',obj,me)
			}
		});
	},

	// 做对1考试题，可以通过
	onPass: function(){
		var me = this;
		var objective_answer = me.down('panel[itemId=topicInfo]').getData().objective_answer;

		var actionSheet = Ext.create('Ext.ActionSheet', {
			items: [{
				text: '答案：' + objective_answer,
			},{
				text: '做对，通过知识点学习',
				ui: 'confirm',
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					me.fireEvent('pass', 1,me.getRecord(),me);
				}
			},{
				text: '取消',
				ui: 'decline',
				scope: this,
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
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

	onBack: function(){
		var me = this;
		me.fireEvent('back',me);
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
			me.onBack();
        };     
    }, 

});