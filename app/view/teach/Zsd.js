/**
 * Displays a list of zsd
 */
Ext.define('Youngshine.view.teach.Zsd', {
    extend: 'Ext.dataview.List',
	xtype: 'zsd',

    id: 'zsdList',

    config: {
        layout: 'fit',
		store: 'Zsd',
        //itemHeight: 89,
        emptyText: '空白',
		//disableSelection: true,
        itemTpl: [
            '<div>{zsdName}</div>' +
			'<div style="color:#888;font-size:0.8em;">{gradeName}•{subjectName}</div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '知识点列表',
			items: [{
				ui : 'decline',
				action: 'quit',
				text : '退出',
				handler: function(){
					Youngshine.app.getController('Main').logout()
				}
			},{
				xtype: 'spacer'
			},{
				text : '设置',
				//iconCls: 'settings',
				handler: function(){
					this.up('list').onSetup()
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
});
