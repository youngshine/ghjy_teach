//* Displays a list of course
Ext.define('Youngshine.view.teach.Course', {
    extend: 'Ext.dataview.List',
	xtype: 'course',

    id: 'courseList',

    config: {
        ui: 'round',
		//layout: 'fit',
		store: 'Course',
		disableSelection: true,
        //itemHeight: 89,
        emptyText: '空白',
		striped: true,
        itemTpl: [
			'<div style="color:#888;">{fullDate}｜学生：{studentName}'+
			'<span class="endTime" style="float:right;color:green;">{fullEndtime}</span></div>' + 
			'<div>{zsdName}</div>'
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
				//text : '设置',
				iconCls: 'settings',
				handler: function(){
					this.up('list').onSetup()
				}
			},{
				xtype: 'spacer'
			},{
				text : '＋新增上课',
				//iconCls: 'settings',
				ui: 'action',
				action: 'addnew',
				handler: function(btn){
					btn.up('list').onAddnew(btn)
				}	
			}]
/*		},{
			xtype: 'label',
			docked: 'top',
			html: '',
			itemId: 'teacher',
			style: 'text-align:center;color:#888;font-size:0.9em;margin:5px;' */
    	}],
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
			width: 330,height: 200,
			scrollable: true,

	        items: [{	
	        	xtype: 'toolbar',
	        	docked: 'top',
	        	title: '密码修改',
				items: [{
					text: '保存',
					ui: 'confirm',
					action: 'save',
					handler: function(btn){
						var psw1 = btn.up('panel').down('passwordfield[itemId=psw1]').getValue().trim(),
							psw2 = btn.up('panel').down('passwordfield[itemId=psw2]').getValue().trim()
						console.log(psw1)
						if(psw1.length<6){
							Ext.toast('密码长度至少6位',3000)
							return
						}
						if(psw1 != psw2){
							Ext.toast('确认密码错误',3000)
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
								Ext.toast('密码修改成功',3000)
								btn.up('panel').destroy()
						    }
						});
					}
				}]
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
							//this.up('panel').down('button[action=save]').setText('保存')
						},					
					},
					scope: this
				},{
					xtype : 'passwordfield',
					itemId : 'psw2',
					//margin: '1 10 0 10',
					label : '确认密码',
					scope: this
				}]	
			}],	
		})
		this.overlay.show()
	},	
	
	// 开始上课 ，small window-overlay
	onAddnew: function(btnAddnew){
		var me = this; 	
		me.overlay = Ext.Viewport.add({
			xtype: 'panel',
			modal: true,
			//hideOnMaskTap: true,
			centered: true,
			width: '100%',
			height: 280,
			scrollable: true,

	        items: [{	
	        	xtype: 'toolbar',
	        	docked: 'top',
	        	title: '上课',
				items: [{
					text : '取消',
					ui: 'decline',
					//iconCls: 'delete',
					handler: function(btn){
						btn.up('panel').destroy()
					}
				},{
					xtype: 'spacer'
				},{
					text : '确定',
					ui: 'confirm',
					disabled: true,
					action: 'save',
					handler: function(btn){
						// 判断选择知识点的课时是否超过购买的prepaid.times
						var prepaidID = Ext.getStore('Zsd').getAt(0).get('prepaidID'),
							prepaidTimes = Ext.getStore('Zsd').getAt(0).get('times')
						// getStore('Course') 计算本prepaid的记录数＊2=总课时
						var usedTimes = 0
						var storeCourse = Ext.getStore('Course');
						console.log(storeCourse.getCount()+'条')
						storeCourse.each(function(record){
							//console.log(record.data)
							if(record.data.prepaidID == prepaidID) usedTimes += 1*2
						})
						console.log(usedTimes)
						
						if(usedTimes >= prepaidTimes){
							Ext.toast('已经超过订单课时，不能再上课',3000); return
						}
						
						
						btn.setDisabled(true); //避免重复tap
						var studentstudyID = this.up('panel').down('selectfield[itemId=zsd]').getValue();
						console.log(studentstudyID)
						if (studentstudyID==null || studentstudyID==''){
							Ext.toast('请选择知识点',3000);return;
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
								//btnSave.setText('创建上课成功')
								Ext.getStore('Course').load(); //reload
								//setTimeout(me.overlay.destroy(), 3000 )
								setTimeout(function(){ //延迟，才能滚动到最后4-1
									me.overlay.destroy();
								},100);
								//Ext.toast('创建上课成功');
								// 禁用新增
								btnAddnew.setDisabled(true)
								//Youngshine.app.getApplication().getController('Teach').getCourse().down('button[action=addnew]').setDisabled(true)
						    }
						});
					}	
				}]
			},{
				xtype: 'fieldset',
				width: '98%',
				title: '<div style="color:#888;">选择上课的学生及其知识点</div>',
				items: [{
					xtype: 'selectfield',
					label: '学生', //选择后本地缓存，方便下次直接获取
					labelWidth: 80,
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
							this.up('panel').down('selectfield[itemId=zsd]').reset();
							this.up('panel').down('button[action=save]').setDisabled(true);
							loadZsd(this.getValue())
						},					
					},
				},{
					xtype: 'selectfield',
					label: '知识点', //选择后本地缓存，方便下次直接获取
					labelWidth: 80,
					itemId: 'zsd',
					//id: 'mySchool',
					displayField: 'zsdName',
					valueField: 'studentstudyID',
					store: 'Zsd',
					autoSelect: false, 	
					defaultPhonePickerConfig: {
						doneButton: '确定',
						cancelButton: '取消'
					},
					listeners: {
						change: function(field,newValue){
							console.log(newValue)
							if(newValue != null )
								this.up('panel').down('button[action=save]').setDisabled(false);
						},					
					},
				},{
					xtype: 'textfield',
					label: '时间',
					labelWidth: 80,
					value: new Date().toLocaleString(),
					disabled: true
				}]	
			/*	
			},{
				xtype: 'button',
				text: '提交',
				action: 'save',
				disabled: true,
				margin: '-15 10 15',
				ui: 'confirm',
				handler: function(){
					var btnSave = this.up('panel').down('button[action=save]');
					//if(btnSave.getText() != '提交') return false;
					
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
							Ext.getStore('Course').load(); //reload
							//setTimeout(me.overlay.destroy(), 3000 )
							setTimeout(function(){ //延迟，才能滚动到最后4-1
								me.overlay.destroy();
							},500);
							//Ext.toast('创建上课成功');
					    }
					});
				}  */
			}],	
		})
		//me.overlay.show()
		
		// 选择学生后，显示该学生正在报读知识点
		function loadZsd(studentID){
			var obj = {
				"studentID": studentID,
				"teacherID": sessionStorage.teacherID
			}
			var store = Ext.getStore('Zsd'); 
			store.removeAll(true)
			store.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
				'readZsdList.php?data='+JSON.stringify(obj) );
			store.load({ //异步async
				callback: function(records, operation, success){
					if (success){
						console.log(records[0])
						//Ext.Viewport.setMasked(false);
						//Ext.Viewport.setActiveItem(me.student);
						//me.down('selectfield[itemId=zsd]').reset();
					}else{
						//me.alertMsg('服务请求失败',3000)
						Ext.toast('出错',3000);
					};
				}   		
			});
		}
		
		// 先清除知识点
		//Ext.getStore('Zsd').removeAll(true)
		// 预先加载的数据，成功后显示表单
		var obj = {
			"teacherID": sessionStorage.teacherID,
		}
		var store = Ext.getStore('Student'); 
		store.removeAll(true)
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
					Ext.toast('出错',3000);
				};
			}   		
		});	
	},
});
