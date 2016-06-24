/**
 * Displays a list of zsd
 */
Ext.define('Youngshine.view.teach.Course', {
    extend: 'Ext.dataview.List',
	xtype: 'course',

    id: 'courseList',

    config: {
        layout: 'fit',
		store: 'Course',
        //itemHeight: 89,
        emptyText: '空白',
		//disableSelection: true,
        itemTpl: [
            '<div style="color:#888;font-size:0.8em;">时间：{beginTime}</div>' +
			'<div>{zsdName}</div>' +
			'<div style="color:#888;font-size:0.8em;">学生：{studentName}</div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '课时列表',
			items: [{
				ui : 'decline',
				action: 'quit',
				text : '退出',
				handler: function(){
					Youngshine.app.getController('Main').logout()
				}
			},{
				text : '设置',
				//iconCls: 'settings',
				handler: function(){
					this.up('list').onSetup()
				}
			},{
				xtype: 'spacer'
			},{
				text : '＋新增上课',
				//iconCls: 'settings',
				handler: function(){
					this.up('list').onAddnew()
				}	
			}]
		},{
			xtype: 'label',
			docked: 'top',
			html: '',
			itemId: 'teacher',
			style: 'text-align:center;color:#888;font-size:0.9em;margin:5px;'
    	}],
		
		//selectedRecord: null,
    },
	
	// 设置密码 ，small window-overlay
	onSetup: function(){
		var me = this; 
		this.overlay = Ext.Viewport.add({
			xtype: 'panel',
			modal: true,
			hideOnMaskTap: true,
			showAnimation: {
				
			},
			hideAnimation: {
				
			},
			centered: true,
			width: 330,height: 220,
			scrollable: true,

	        items: [{	
	        	xtype: 'toolbar',
	        	docked: 'top',
	        	title: '密码修改',
			},{
				xtype: 'fieldset',
				width: 300,
				//margin: '10 10 0 10',
				items: [{
					xtype : 'passwordfield',
					itemId : 'psw1',
					//margin: '1 10 0 10',
					placeHolder: '长度至少6位',
					label : '新密码', //比对确认密码
					listeners: {
						focus: function(){
							this.up('panel').down('button[action=save]').setText('保存')
						},					
					},
					scope: this
				},{
					xtype : 'passwordfield',
					itemId : 'psw2',
					//margin: '1 10 0 10',
					label : '确认密码',
					listeners: {
						focus: function(){
							this.up('panel').down('button[action=save]').setText('保存')
						},					
					},
					scope: this
				}]	
			},{
				xtype: 'button',
				text: '保存',
				action: 'save',
				margin: '-15 10 15',
				ui: 'confirm',
				handler: function(){
					var btnSave = this.up('panel').down('button[action=save]');
					if(btnSave.getText() != '保存') return false;
					
					var psw1 = this.up('panel').down('passwordfield[itemId=psw1]').getValue().trim(),
						psw2 = this.up('panel').down('passwordfield[itemId=psw2]').getValue().trim()
					console.log(psw1)
					if(psw1.length<6){
						btnSave.setText('密码少于6位')
						return
					}
					if(psw1!= psw2){
						btnSave.setText('确认密码错误')
						return
					}
					// ajax
					Ext.Ajax.request({
					    url: Youngshine.app.getApplication().dataUrl + 'updatePsw.php',
					    params: {
					        psw1     : psw1,
							//psw2     : psw2,
							teacherID: localStorage.teacherID
					    },
					    success: function(response){
					        var text = response.responseText;
					        // process server response here
							btnSave.setText('修改成功')
					    }
					});
				}
			}],	
		})
		this.overlay.show()
	},	
	
	// 开始上课 ，small window-overlay
	onAddnew: function(){
		var me = this; 
		
		me.overlay = Ext.Viewport.add({
			xtype: 'panel',
			modal: true,
			hideOnMaskTap: true,
			centered: true,
			width: '100%',
			height: 220,
			scrollable: true,

	        items: [{	
	        	xtype: 'toolbar',
	        	docked: 'top',
	        	title: '创建上课课时',
			},{
				xtype: 'fieldset',
				width: '100%',
				//margin: '10 10 0 10',
				items: [{
					xtype: 'selectfield',
					label: '学生', //选择后本地缓存，方便下次直接获取
					itemId: 'student',
					//id: 'mySchool',
					displayField: 'studentName',
					valueField: 'studentID',
					store: 'Student',
					autoSelect: false, 	
					defaultPhonePickerConfig: {
						doneButton: '确定',
						cancelButton: '取消'
					},
					listeners: {
						change: function(){
							showZsd(this.getValue())
						},					
					},
				},{
					xtype: 'selectfield',
					label: '知识点', //选择后本地缓存，方便下次直接获取
					itemId: 'zsd',
					//id: 'mySchool',
					displayField: 'zsdName',
					valueField: 'studentstudyID',
					store: 'Zsd',
					autoSelect: false, 	
					defaultPhonePickerConfig: {
						doneButton: '确定',
						cancelButton: '取消'
					}
				}]	
			},{
				xtype: 'button',
				text: '保存',
				action: 'save',
				margin: '-15 10 15',
				ui: 'confirm',
				handler: function(){
					var btnSave = this.up('panel').down('button[action=save]');
					if(btnSave.getText() != '保存') return false;
					
					var studentstudyID = this.up('panel').down('selectfield[itemId=zsd]').getValue();
					console.log(studentstudyID)
					if (studentstudyID==null || studentstudyID==''){
						Ext.Msg.alert('请选择学生报读知识点');
						return;
					}
					// ajax
					Ext.Ajax.request({
					    url: Youngshine.app.getApplication().dataUrl + 'createCourse.php',
					    params: {
							studentstudyID: studentstudyID
					    },
					    success: function(response){
					        var text = response.responseText;
					        // process server response here
							btnSave.setText('创建上课成功')
					    }
					});
				}
			}],	
		})
		//me.overlay.show()
		
		function showZsd(studentID){
			// 选择学生后，显示该学生正在报读知识点
			var obj = {
				"studentID": studentID,
				"teacherID": localStorage.teacherID
			}
			var store = Ext.getStore('Zsd'); 
			store.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
				'readZsdList.php?data='+JSON.stringify(obj) );
			store.load({ //异步async
				callback: function(records, operation, success){
					if (success){
						//Ext.Viewport.setMasked(false);
						//Ext.Viewport.setActiveItem(me.student);
						//me.down('selectfield[itemId=zsd]').setAutoSelect(false);
						//me.down('selectfield[itemId=zsd]').setStore(store)
					}else{
						//me.alertMsg('服务请求失败',3000)
						Ext.Msg.alert(result.message);
					};
				}   		
			});
		}
		
		// 预先加载的数据
		var obj = {
			"teacherID": localStorage.teacherID,
		}
		var store = Ext.getStore('Student'); 
		store.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
			'readStudentList.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				if (success){
					//Ext.Viewport.setMasked(false);
					//Ext.Viewport.setActiveItem(me.student);
					me.overlay.show()
				}else{
					//me.alertMsg('服务请求失败',3000)
					Ext.Msg.alert(result.message);
				};
			}   		
		});	
	},
});