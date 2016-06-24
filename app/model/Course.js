// 某个老师 a particular 已上课的课时
Ext.define('Youngshine.model.Course', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
			{name: 'courseID'}, 
			{name: 'studentstudyID'}, 
			{name: 'beginTime'}, 
			{name: 'endTime'}, 
			{name: 'zsdName'}, //本课时的知识点
			{name: 'zsdID'}, 
			{name: 'subjectName'}, 
			{name: 'subjectID'}, 
			{name: 'studentName'}, 
			{name: 'studentID'},
			{name: 'level_list'}, // 学生学科初始水平：高中低
			{name: 'created'} // sort by
        ]
    }
});