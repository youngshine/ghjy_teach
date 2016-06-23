// 当堂课（知识点）的报读学生列表
Ext.define('Youngshine.model.Student', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
			{name: 'studentID'}, 
			{name: 'studentName'}, 
			//{name: 'grade'}, 
			//{name: 'school'}, 
			{name: 'level_list'}, //各学科123报读咨询测评的水平，以获得自适应第一组5个题目
			
			{name: 'studentstudyID'}, //报读记录：获得知识点
			{name: 'zsdID'}, //该学生报读的知识点
			{name: 'subjectID'}, //该学生报读的知识点的学科，以便获得学生该学科初始水平level
			
			{name: 'pass'}, // 通过学习
			{name: 'pass_date'},
			
			{ name: 'fullPass', convert: function(value, record){
					return record.get('pass')==1?'通过学习':''
				} 
			},
        ]
    }
});