Ext.define('Youngshine.view.teach.Pdf-file',{
	extend: 'Ext.Container',
	xtype: 'pdf-file',
	requires: ['Youngshine.view.teach.pdf.PDF'],
	
	config:{
		layout: 'fit',
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '知识点讲解',
			items: [{					
				text: '关闭',
				ui: 'decline',
				handler: function(btn){
					btn.up('pdf-file').onBack()
				}
			}] 
		},{		
			xtype: 'pdfpanel',
			//src: 'script/PDF/xiangqian.pdf',//'script/PDF/iPhoneDistributionBuildCheatsheet.pdf',
			style: 'background-color: #222;'
		}]
	},
	
	// 返回
	onBack: function(){
		this.fireEvent('back',this)
	},
});