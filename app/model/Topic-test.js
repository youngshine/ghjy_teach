// 当堂课的教学考试题目
Ext.define('Youngshine.model.Topic-test', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
			{name: 'topictestID'}, 
			{name: 'studentstudyID'}, //学生报读知识点记录，包括student+zsd 
			{name: 'topicID'}, 
			{name: 'gid'},  //新题库题目id
			{name: 'studentID'}, //对应个体学生的
			{name: 'zsdID'}, //对应的报读唯一知识点
			{name: 'zsdName'}, 
			{name: 'subjectID'}, //学科
			{name: 'subjectName'},
			{name: 'done'}, //题目做完
			{name: 'tested'}, //是否测试
			{name: 'passed'}, //通过
			
			//{name: 'pic_teach'}, //例题
			//{name: 'pic_teach_answer'}, //教学例题的答案（图片格式）
			{name: 'content'}, //例题
			{name: 'answer'}, //answer
			
			{name: 'objective_flag'}, //考试采用客观选择题目
			{name: 'objective_answer'}, //选择题答案：a,b,c
			
			{name: 'level'}, //难度 1，2，3
			{name: 'created'}, //排序用
			
			{ name: 'fullDone', convert: function(value, record){
					var done = record.get('done');
					if(done==0)
						return '做错'
					if(done==1)
						return '做对';
				} 
			}, 
			{ name: 'fullLevel', convert: function(value, record){
					var level = record.get('level');
					if(level==1)
						return '低';
					if(level==2)
						return '中';
					if(level==3)
						return '高';
				} 
			},
        ]
    }
});