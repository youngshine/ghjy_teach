Ext.define('Youngshine.view.Login', {
    extend: 'Ext.form.Panel',
    xtype: 'login',
	
    config: {
/*        showAnimation: {
            type: "slide",
            direction: "down",
            duration: 300
        },
        hideAnimation: {
            type: "slide",
            direction: "up",
            duration: 300
        },
*/		
		layout: {
			type: 'vbox',
			pack: 'top',
			align: 'stretch'
		},
		
    	//layout: 'fit',
    	items: [{
/*    		xtype: 'toolbar',
    		docked: 'top',
    		title: '教师终端', /*
			items: [{
				xtype: 'spacer'
			},{
				ui : 'confirm',
				action: 'login',
				text : '登录'
			}] 
    	},{ */
    		xtype: 'fieldset',
			title: '<div style="color:#888;">根号教育 • 教师PAD</div>',
			style: {
				maxWidth: '480px',
				margin: '50px auto 0',
				labelWidth: 65,
			},
    		items: [{
    			xtype: 'textfield',
				itemId: 'username',
    			label: '账号',
				placeHolder: '',
				clearIcon: false
    		},{
    			xtype : 'passwordfield',
				//itemId : 'psw',
				label : '密码',
				clearIcon: false
/*			},{
				xtype: 'selectfield',
				label: '校区', //选择后本地缓存，方便下次直接获取
				itemId: 'school',
				//id: 'mySchool',
				displayField: 'schoolName',
				valueField: 'schoolName', //schoolID，无法setValue()获得缓存的localstorage显示
				store: 'School',
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				} */
			},{
				xtype: 'textfield',
				itemId: 'school',
    			label: '校区',
				placeHolder: '输入加盟校区',
				clearIcon: false
    		}]
    	},{
			//html: '<br /><div class="forgetpassword" style="float:right;color:#fff;">忘记密码？</div>'
			xtype: 'button',
			//style: 'margin:-10px 10px',
			text : '登录',
			ui : 'plain',
			action: 'login',
			disabled: true,
			style: {
				color: '#fff',
				background: '#66cc00',
				//border: '1px solid #9d9d9d'
				margin: '15px auto',
				maxWidth: '474px'
			}
		}],
    	
    	listeners: [{
    		delegate: 'button[action=login]',
    		event: 'tap',
    		fn: 'onLogin'
		},{
    		delegate: 'textfield',
    		event: 'keyup',
    		fn: 'onSetBtn'	
		},{
    		delegate: 'passwordfield',
    		event: 'change',
    		fn: 'onSetBtn'
    	},{
			/*测试用 填入用户和密码
    		delegate: 'button[action=demo]',
    		event: 'tap',
    		fn: function(){
				this.down('textfield[name=Phone]').setValue('15806662811');
				this.down('textfield[name=Password]').setValue('123');
			}
		},{ */
    		element: 'element', //忘记密码 <a>超链接，属于dom
			delegate: 'div.forgetpassword',
			event: 'tap',
			fn: 'onForgetpassword'				
		}]
    },
    
	// 控制器Main
    onLogin: function(){
    	// 带入参数：当前表单的用户名和密码
    	var obj = {
    		"username": this.down('textfield[itemId=username]').getValue().trim(),
			"psw"     : this.down('passwordfield').getValue().trim(),
			"school"  : this.down('textfield[itemId=school]').getValue().trim()
    	}
    	this.fireEvent('loginOk', obj,this);		
    },	

	onSetBtn: function(){
		var username = this.down('textfield[itemId=username]').getValue().trim(),
			psw = this.down('passwordfield').getValue().trim(),
			school = this.down('textfield[itemId=school]').getValue().trim();
	
		var btnLogin = this.down('button[action=login]')	
		if(username != '' && psw != '' && school != ''){
			btnLogin.setDisabled(false);
		}else{
			btnLogin.setDisabled(true);
		}				
	},
	
	// 初始化
    initialize: function() {
        this.callParent();
		this.on({
            scope: this,
            painted: 'onPainted',
        });
    },
    onPainted: function() {
		console.log(sessionStorage.school)
		this.down('textfield[itemId=username]').setValue(sessionStorage.teacherName)
		this.down('textfield[itemId=school]').setValue(sessionStorage.school)
		//Ext.getCmp('mySchool').setValue(localStorage.school)
    },
});