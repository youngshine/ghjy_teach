// 某个老师 a particular教学知识点列表
Ext.define('Youngshine.model.Zsd', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
			{name: 'zsdID'}, 
			{name: 'zsdName'}, 
			{name: 'gradeName'}, 
			{name: 'gradeID'}, 
			{name: 'subjectName'}, 
			{name: 'subjectID'}, 
			{name: 'teacherID'}, 
			{name: 'PDF'}, 
			{name: 'studentstudyID'}, //报读记录：获得知识点
			{name: 'times'}, //课时
			{name: 'prepaidID'} //对应购买订单的总课时
        ]
    }
});