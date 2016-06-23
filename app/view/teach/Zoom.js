Ext.define('Youngshine.view.teach.Zoom',{
	extend: 'Ext.Container',
	xtype: 'imagezoom',
	requires: ['Youngshine.view.teach.ImageViewer'],
	
	config:{
		layout: 'fit',
		items: [{
		/*	xtype: 'toolbar',
			docked: 'top',
			title: '车辆图片',
			items: [{					
				text: '返回',
				ui: 'back',
				action: 'back'
			}] 
		},{		*/
			xtype: 'imageviewer',
			imageSrc: '',
			indicator: false,
			style: 'background-color: #222;'
		}]
	},
	initialize: function() {
		this.callParent(arguments);
		var me = this;
		var oldView = Ext.Viewport.getActiveItem();
		this.element.on({
			tap : function(e) {
				//var from = me.getFrom();
				//me.fireEvent('zoominoutTap',from);
				//Ext.Viewport.setActiveItem('topic-teach-show')
				Ext.Viewport.setActiveItem(oldView);
				me.destroy();
			}
		})
    }
});