/**
 * Displays a list of 报读某个知识点的学生列表
 */
Ext.define('Youngshine.view.teach.Student', {
    extend: 'Ext.dataview.List',
	xtype: 'student',

    id: 'studentList',

    config: {
        store: 'Student',
        //itemHeight: 89,
        //emptyText: '学生列表',
		disableSelection: true,
        itemTpl: [
            '<div>{studentName}<span style="float:right;color:#888;">{fullPass}</span></div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '报读学生',
			items: [{
				ui : 'back',
				action: 'zsd',
				text : '知识点',
				handler: function(){
					this.up('list').onZsd()
					//this.up('student').onZsd()
					//Ext.Viewport.remove(Youngshine.app.getController('Teach').student)
				}
			},{
				ui : 'decline',
				action: 'quit',
				text : '退出',
				hidden: true,
				handler: function(){
					Youngshine.app.getController('Main').logout()
				}	
			},{
				xtype: 'spacer'
			},{
				//ui : 'action',
				action: 'pdf',
				//iconCls: 'info',
				text : 'PDF讲解',
				handler: function(){
					this.up('student').onPDF()
				}		
			}]
		},{
			xtype: 'label',
			docked: 'top',
			html: '',
			itemId: 'zsd',
			style: 'text-align:center;color:#888;font-size:0.9em;margin:5px;'
    	}],
		
		record: null,
    },
	
	// 显示知识点
	onZsd: function(){
		var me = this;
		me.fireEvent('zsd',me)
	},
	onPDF: function(){
		var me = this;
		me.fireEvent('pdf',me.getRecord())
	}
});
