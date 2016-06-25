// 教学控制器，zsd,student,topic-teach
Ext.define('Youngshine.controller.Teach', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	zsd: 'course',
			zsd: 'zsd',
			student: 'student',
			topicteach: 'topic-teach',
			topicteachshow: 'topic-teach-show',
			topicteachphotos: 'topic-teach-photos',
			topicteachtest: 'topic-teach-test',
        },
        control: {
			course: {
				//select: 'zsdSelect', //itemtap
				itemtap: 'courseItemtap', 
				itemswipe: 'courseItemswipe'
			},
			student: {
				itemtap: 'studentItemtap', 
				zsd: 'studentZsd', //返回显示知识点列表
				pdf: 'studentPDF'
			},
			topicteach: {
				fetchTopic: 'topicteachFetch',//抓取自适应考题 
				course: 'topicteachCourse', //返回学生列表
				photos: 'topicteachPhotos', //该学生该知识点教学过程
				test: 'topicteachTest', //昨对10题，考试给家长看
				pass: 'topicteachPass', //通过学习，不能再操作
				pdf: 'topicteachPDF',
				itemtap: 'topicteachItemtap',
			},
			topicteachshow: {
				del: 'topicteachshowDelete', 
				done: 'topicteachshowDone' // 评分
			},
			topicteachphotos: {
				del: 'topicteachphotosDelete', //删除一个图片
			},
			topicteachtest: {
				fetchTopicTest: 'topicteachtestFetch', //随机出一个考题
				//itemtap: 'topicteachtestAnswer'
				pass: 'topicteachtestPass', //通过学习，不能再操作
			},
        }
    },

	// 登录后跳转这里 teaching zsd list of a particular teacher
	showCourse: function(teacherID){
		var me = this;
		
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在加载'});
		// 预先加载的数据
		var obj = {
			"teacherID": teacherID
		}
		var store = Ext.getStore('Course'); 
		store.getProxy().setUrl(this.getApplication().dataUrl + 
			'readCourseList.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				if (success){
    				console.log(records);
					//me.showSearch();
					Ext.Viewport.setMasked(false);
					
					// 跳转页面：选择当堂课教授知识点列表
					//Ext.Viewport.remove(me.getLogin(),true); // dom remove myself
					
					me.course = Ext.create('Youngshine.view.teach.Course')
					me.course.down('label[itemId=teacher]').setHtml(localStorage.teacherName)	
					//viewport.setActiveItem()
					Ext.Viewport.add(me.course);
				}else{
					me.alertMsg('服务请求失败',3000)
				};
			}   		
		});
	},	
	//zsdSelect: function(list,record){
	zsdItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		//list.down('button[action=done]').enable();
		//list.setSelectedRecord(record);
		//console.log(list.getSelectedRecord());
		//me.showStudent(record);	
		console.log(record.data)
		//list.destroy()
		
		if(!me.student){
			me.student = Ext.create('Youngshine.view.teach.Student')
			Ext.Viewport.add(me.student)
		}
		
		me.student.setRecord(record); //带入当前知识点
		me.student.down('label[itemId=zsd]').setHtml(record.data.zsdName)
		
		Ext.Viewport.setMasked({xtype:'loadmask',message:'读取学生列表'});
		// 预先加载的数据
		var obj = {
			"teacherID": record.data.teacherID,
			"zsdID": record.data.zsdID, // zsdID不唯一，因三个表
			"subjectID": record.data.subjectID
		}
		var store = Ext.getStore('Student'); 
		store.getProxy().setUrl(this.getApplication().dataUrl + 
			'readStudentList.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				if (success){
					Ext.Viewport.setMasked(false);
					Ext.Viewport.setActiveItem(me.student);
				}else{
					//me.alertMsg('服务请求失败',3000)
					Ext.Msg.alert(result.message);
				};
			}   		
		});	
	},

	// 返回知识点列表，store不变
	studentZsd: function(win){		
		var me = this;
		//var view = Ext.create('Youngshine.view.teach.Zsd');
		//Ext.Viewport.add(view)
		//Ext.Viewport.setActiveItem(view)
		//Ext.Viewport.setActiveItem(this)
		//Ext.Viewport.remove(win)
		if(!me.zsd){
			me.zsd = Ext.create('Youngshine.view.teach.Zsd')
			Ext.Viewport.add(me.zsd)
		}
		Ext.Viewport.setActiveItem(me.zsd)
	},
	
	topicteachPDF: function(rec){		
		console.log(rec);
		var pdffile = '';
		if(rec.data.subjectID==1){
			pdffile = '../PDF/sx/'
		}else if(rec.data.subjectID==2){
			pdffile = '../PDF/wl/'
		}else if(rec.data.subjectID==2){
			pdffile = '../PDF/hx/'
		}
		pdffile += rec.data.PDF
		console.log(pdffile)
		
		var view = Ext.create('Youngshine.view.teach.Pdf-file')
		view.down('pdfpanel').setSrc(pdffile); // pdf file in zsd table
		Ext.Viewport.add(view)
		Ext.Viewport.setActiveItem(view);
	},
	
	courseItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		console.log(record.data)
		//list.down('button[action=done]').enable();
		//list.setSelectedRecord(record);
		//console.log(list.getSelectedRecord());
		//list.destroy()
		//list.down('button[action=zsd]').disable(); //不能再返回选择知识点
		// remove zsd view?
		//this.getZsd().destroy()
		
		//me.showTopicteach(record);
		
		if(!me.topicteach){
			me.topicteach = Ext.create('Youngshine.view.teach.Topic-teach')
			Ext.Viewport.add(me.topicteach)
		}
		me.topicteach.setRecord(record);
		me.topicteach.down('toolbar').setTitle(record.data.studentName)
		
		//Ext.Viewport.setActiveItem(this.topicteach);
		
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在加载'});
		// 预先加载的数据
		var obj = {
			//"zsdID": record.data.zsdID,
			//"level": record.data.level
			"studentstudyID": record.data.studentstudyID, //zsd & student
			"subjectID": record.data.subjectID // 题目按学科分3个表
		}
		var store = Ext.getStore('Topic-teach'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readTopicteachList.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				if (success){
    				console.log(records);
					Ext.Viewport.setMasked(false);
					Ext.Viewport.setActiveItem(me.topicteach);
					
					var btnTest = me.topicteach.down('button[action=test]'),
						btnPhoto = me.topicteach.down('button[action=photo]')
					console.log(btnPhoto)
					btnTest.setHidden(records.length<10 ? true : false)
					//btnPhoto.setHidden(records.length<1 ? true : false)
				}else{
					//me.alertMsg('服务请求失败',3000)
					Ext.Msg.alert(result.message);
				};
			}   		
		});		
	},
	courseItemswipe: function( list, index, target, record, e, eOpts ){
		console.log(e);console.log(record)
		if(e.direction !== 'left') return false
			
		var me = this;
		list.select(index,true); // 高亮当前记录
		var actionSheet = Ext.create('Ext.ActionSheet', {
			items: [{
				text: '移除当前行',
				ui: 'decline',
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					deleteCourse(record)
				}
			},{
				text: '取消',
				scope: this,
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					list.deselect(index); // cancel高亮当前记录
				}
			}]
		});
		Ext.Viewport.add(actionSheet);
		actionSheet.show();	
		
		function deleteCourse(rec){
			// ajax instead of jsonp
			Ext.Ajax.request({
			    url: me.getApplication().dataUrl + 'deleteCourse.php',
			    params: {
					courseID: rec.data.courseID
			    },
			    success: function(response){
			        //var text = response.responseText;
			        Ext.getStore('Course').remove(rec); 
			    }
			});
		}
	},	

	// 返回选择学生，store不变
	topicteachCourse: function(win){		
		var me = this;
		if(!me.course){
			me.course = Ext.create('Youngshine.view.teach.Course')
			Ext.Viewport.add(me.course)
		}
		//me.student.down('button[action=zsd]').setHidden(true); //disable(不能再返回选择知识点
		//me.course.down('button[action=quit]').setHidden(false); //退出app
		Ext.Viewport.setActiveItem(me.course)
		//Ext.Viewport.setActiveItem(this)
		//Ext.Viewport.remove(win)
	},
	// 返回选择学生，store不变
	topicteachPhotos: function(rec,oldView){		
		var me = this;
		me.studyphotos = Ext.create('Youngshine.view.teach.Topic-teach-photos')
		me.studyphotos.setOldView(oldView);	// oldView当前父view
		me.studyphotos.setRecord(rec);	// record
		Ext.Viewport.add(me.studyphotos)
		//Ext.Viewport.setActiveItem(view)
		
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在加载'});
		var obj = {
			"studentstudyID": rec.data.studentstudyID, //zsd & student
		}
		var store = Ext.getStore('Study-photos'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readStudyPhotosList.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				if (success){
    				console.log(records);
					Ext.Viewport.setMasked(false);
					Ext.Viewport.setActiveItem(me.studyphotos);
				}else{
					//me.alertMsg('服务请求失败',3000)
					Ext.Msg.alert(result.message);
				};
			}   		
		});	
	},
	// 做题后，考试给家长看, 随机出题，不保存？？？？
	topicteachTest: function(rec,oldView){		
		var me = this; console.log(rec)
		me.topictest = Ext.create('Youngshine.view.teach.Topic-teach-test')
		me.topictest.setOldView(oldView);	// oldView当前父view
		me.topictest.setRecord(rec);	// record
		//me.topictest.down('label[itemId=zsd]').setHtml(rec.data.zsdName)
		Ext.Viewport.add(me.topictest)
		Ext.Viewport.setActiveItem(me.topictest)
		
		//Ext.getStore('Topic-test').removeAll() ; //每次考试题临时表清空
		
		/*
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在加载'});
		var obj = {
			"studentstudyID": rec.data.studentstudyID, //zsd & student
		}
		var store = Ext.getStore('Topic-test'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readTopictestList.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				if (success){
    				console.log(records);
					Ext.Viewport.setMasked(false);
					Ext.Viewport.setActiveItem(me.studyphotos);
				}else{
					//me.alertMsg('服务请求失败',3000)
					Ext.Msg.alert(result.message);
				};
			}   		
		});	 */
	},
	// 通过学习studentstudy报读表，不能再任何题目操作
	topicteachtestPass: function(pass,record,view){
		var me = this;
		console.log(record.data)

		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在更新'});
		var obj = {
			"pass": pass,
			"studentstudyID": record.data.studentstudyID
		}
		Ext.data.JsonP.request({
			url: me.getApplication().dataUrl + 'updateStudentstudy.php',
			callbackKey: 'callback',
			params:{
				data: JSON.stringify(obj)
			},
			success: function(result){
				Ext.Viewport.setMasked(false);
				if(result.success){			
					//返回列表
					//view.destroy();
					me.topicteachStudent()
				}else{
					Ext.Msg.alert(result.message); // 错误模式窗口
				}
			}
		});
	},	
	// 根据level难度 抓取该生的自适应题目，并把记录添加到store:topic-teach
	topicteachFetch: function(obj){
		var me = this;
		console.log(obj); 
		Ext.Viewport.setMasked({xtype:'loadmask',message:'添加自适应题目'});

		// 自适应出题：抓取第一组题目（3,4,5）根据学生level，以后的根据做提评分level
		// 取得记录，直接保存道 topic-teach表，从新load表
    	Ext.data.JsonP.request({			
			url: me.getApplication().dataUrl + 'createTopicteach.php', 
			callbackKey: 'callback',
			timeout: 9000,
			params:{
				data: JSON.stringify(obj)
				/* data: '{"level":"' + level + 
					'","zsdID":"' + zsdID + 
					'","studentstudyID":"' + studentstudyID + '"}' */
			},
			success: function(result){ // 服务器连接成功 
				Ext.Viewport.setMasked(false); 
				if (result.success){ // 返回值有success成功
					//console.log(result.data)
					// 直接添加到后台数据表ghjy_topic-teach，最新在最上面
					Ext.getStore('Topic-teach').load()
					//store.add(result.data).. store.insert()
					//console.log(store.data)		
				}else{
					Ext.Msg.alert(result.message);
				}
			},
		});

	},	
	topicteachItemtap: function(list,index,item,record){
    	var me = this;
		//this.topicteach.hide(); //remove(); 返回用
		this.topicteachshow = Ext.create('Youngshine.view.teach.Topic-teach-show');
		this.topicteachshow.setRecord(record); // 传递参数而已，题目id
		Ext.Viewport.setActiveItem(this.topicteachshow)
	},
	
	topicteachshowDelete: function(record,view){
		var me = this;
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在删除'});
		Ext.data.JsonP.request({
			// 删除服务端记录: 最好做个标记，别真正删除？或者过期的和定期的不能删除？
			// 否则，删除过的题目，添加时候可能再出现
			url: me.getApplication().dataUrl + 'deleteTopicteach.php',
			callbackKey: 'callback',
			params:{
				data: '{"topicteachID":' + record.data.topicteachID + '}'
			},
			success: function(result){
				Ext.Viewport.setMasked(false);
				if(result.success){
					// 服务端删除成功后，客户端store当前记录同时删除，列表list才能相应显示 
					Ext.getStore('Topic-teach').remove(record); //.removeAt(i); 
					//me.getTopicteach().show(); // hide to show
					Ext.Viewport.setActiveItem(me.topicteach);
					view.destroy(); //关闭自己					
				}else{
					Ext.Msg.alert(result.message);
				}
			},
			failure: function(){
				Ext.Viewport.setMasked(false);
				Ext.Msg.alert('服务请求失败');
			}
		});	
	},
	// save & refresh 单个题目show.js
	topicteachshowDone: function(done,fullDone,record,view){
		var me = this;
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在评分'});
		var obj = {
			"done": done,
			"topicteachID": record.data.topicteachID
		}
		Ext.data.JsonP.request({
			url: me.getApplication().dataUrl + 'updateTopicteach.php',
			callbackKey: 'callback',
			params:{
				data: JSON.stringify(obj)
			},
			success: function(result){
				Ext.Viewport.setMasked(false);
				if(result.success){			
					//本地更新数据：打分结果 model.set, setRecord/updateRecord
					//var model = record.data ????????
					record.set('done',done)
					record.set('fullDone',fullDone)
				}else{
					Ext.Msg.alert(result.message); // 错误模式窗口
				}
			}
		});
	},	
	
	// 删除教学图片
	topicteachphotosDelete: function(rec){
		var me = this;
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在删除'});
		Ext.data.JsonP.request({
			url: me.getApplication().dataUrl + 'deleteStudyPhotos.php',
			callbackKey: 'callback',
			params:{
				data: '{"studyphotoID":' + rec.data.studyphotoID + '}'
			},
			success: function(result){
				Ext.Viewport.setMasked(false);
				if(result.success){
					Ext.getStore('Study-photos').remove(rec); 				
				}else{
					Ext.Msg.alert(result.message);
				}
			},
			failure: function(){
				Ext.Viewport.setMasked(false);
				Ext.Msg.alert('服务请求失败');
			}
		});	
	},
	
	// 随机出一个考题，临时表
	topicteachtestFetch: function(obj,win){
		var me = this;
		console.log(obj); 
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在随机出题'});

    	Ext.data.JsonP.request({			
			url: me.getApplication().dataUrl + 'createTopicTest.php', 
			callbackKey: 'callback',
			//timeout: 9000,
			params:{
				data: JSON.stringify(obj)
			},
			success: function(result){ // 服务器连接成功 
				Ext.Viewport.setMasked(false); 
				if (result.success){ // 返回值有success成功
					console.log(result.data[0])
					//win.updateRecord(result.data[0])
					win.down('panel[itemId=topicInfo]').setData(result.data[0]);
					win.down('button[action=pass]').setHidden(false)
					//return
					/*
					var store = Ext.getStore('Topic-test')
					store.removeAll()
					store.insert(0,result.data); //临时保存	
					
					var btnPass = me.topictest.down('button[action=pass]')
					console.log(btnPass)
					btnPass.setHidden(false) */
				}else{
					Ext.Msg.alert(result.message);
				}
			},
		});

	},	
	topicteachtestAnswer: function(list,index,item,record){
    	// 客观选择题目的答案
		Ext.Msg.alert(record.data.objective_answer);
	},

			
	/* 如果用户登录的话，控制器launch加载相关的store */
	launch: function(){
	    this.callParent(arguments);
	},
	init: function(){
		this.callParent(arguments);
		console.log('teach controller init');
	}
});
