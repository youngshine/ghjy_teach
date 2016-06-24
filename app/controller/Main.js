// 处理基本逻辑和登录
Ext.define('Youngshine.controller.Main', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
			login: 'login',
        },
        control: {
			login: {
				loginOk: 'loginOk',
				//loginForgetpassword: 'loginForgetpassword' //忘记密码
			}
        },
        before: {
        
        },
        routes: {
        	//'main': 'showMain',
        	//'login': 'showLogin',
        	//'register': 'showRegister'
        }
    },

	/* 登录界面，公用类，许多地方调用src，成功登录跳转to 
	   参数：调用来源src,登录后跳转到的页面to，来自注册成功的帐号username、密码password（不用再输入）
	   调用：1)主界面登录main、2)要发布routenew或收藏线路或联系对方routeshow、
	         3)注册成功后跳转的登录register(username/password)、4)注销后跳转登录logout(username,''空密码)  */

    // 登陆，带入参数 username,password,to, to用来成功后跳到哪个页面，来自参数
	/* 登陆后（包括注册成功默认登录），
	1)保存登录状态（客户端isLogin、服务端php更改数据库）
	2)抓取未读信息列表（定期）
	3)获得当前地理位置，发给服务端 （定期）
	*/
    loginOk: function(username,psw,school){  	
    	var me = this;
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在登录'});
		
    	Ext.data.JsonP.request({			
			url: me.getApplication().dataUrl + 'login.php',
			callbackKey: 'callback',
			timeout: 10000,
			params:{
				data: '{"username":"' + username + '","psw":"' + psw + '","school":"' + school + '"}'
			},
			success: function(result){ // 服务器连接成功
				/* 登录成功后 
				   1)CarpoolGlobal.MemberInfo.Member_ID改变值 2)未读消息 3）位置信息 */
				//myMsgbox.hide(); //关闭提示窗口  
				Ext.Viewport.setMasked(false); 
				if (result.success){ // 返回值有success成功
					console.log(result.data)
					//localStorage.setItem('isLogin',true); // 登录状态
					localStorage.setItem('teacherID',result.data.teacherID);
					localStorage.setItem('teacherName',result.data.teacherName);
					localStorage.setItem('school',result.data.schoolName); // not schoolID
					 // 会员id保存在localstorage，app.js, logout退出到登录界面用？4.4

					// 登录成功，发送地理位置，给服务器 600秒一次？
					
					// 跳转页面：选择当堂课教授知识点列表
					//me.showZsd(result.data.teacherID);
					me.getApplication().getController('Teach').showCourse(result.data.teacherID);
					Ext.Viewport.remove(me.getLogin(),true); // dom remove myself
					//Ext.Viewport.setActiveItem(Ext.create('Youngshine.view.teach.Zsd'));  					
				}else{
					Ext.Msg.alert(result.message);
				}
			},
			failure: function(){
				//myMsgbox.hide();
				Ext.Viewport.setMasked(false);
				Ext.Msg.alert('服务请求失败');
			}
		});
	},
	// 用户注销退出，来自Main控制器
	// 清除全局变量，清除界面，清除localstorage 状态，清除定期发生的函数（位置刷新和未读消息抓取）
	// 清除views,removeAll(true,true),控制器、store不清除？
	// store.removeAll(true,true)别清除本地数据，换个帐号登录，本地数据如何办？id区分？
	logout: function(){
    	Ext.Msg.confirm('',"确认退出？",function(btn){	
			if(btn == 'yes'){
				Ext.Viewport.setMasked({xtype:'loadmask',message:'正在注销'});
				window.location.reload();
			}
		});
	},
	
	// 公用提示，2秒自动消失
	alertMsg: function(msg,timeLength){
		Ext.Viewport.setMasked({
			xtype: 'loadmask',
			message: '<div style="padding:10px 15px;color:#fff;background:#777;">' + msg + '</div>',
			indicator: false,
		});
		setTimeout(function(){ //延迟，才能滚动到最后4-1
			Ext.Viewport.setMasked(false);
		},timeLength);
	},
	
	// controller launch Called by the Controller's application immediately after the Application's own launch function has been called. This is usually a good place to run any logic that has to run after the app UI is initialized. 
	launch: function(){
		console.log('main controller launch logic');
		var me = this;
		
		//Ext.Viewport.setMasked({xtype:'loadmask',message:'读取加盟校区'});
		// 预先加载的数据
		var store = Ext.getStore('School'); 
		store.getProxy().setUrl(this.getApplication().dataUrl + 'readSchoolList.php');
		store.load({ //异步async
			callback: function(records, operation, success){
				if (success){
    				console.log(records[0].data);
					//me.showSearch();
					//Ext.Viewport.setMasked(false)
					Ext.fly('appLoadingIndicator').destroy();
					
					// 在这里调用login，才能取得localstorage
					var view = Ext.create('Youngshine.view.Login');
					Ext.Viewport.add(view);
					Ext.Viewport.setActiveItem(view);
				}else{
					me.alertMsg('服务请求失败',3000)
					/*Ext.Viewport.setMasked({
						xtype: 'loadmask',
						message: '<div style="padding:50px 20px;color:#fff;">网络错误<br>服务请求失败</div>',
						indicator: false,
					});
					setTimeout(function(){ //延迟，才能滚动到最后4-1
						Ext.Viewport.setMasked(false);
					},3000); */
				};
			}   		
		});
		
	}
    
});