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
			{name: 'PDF'}, 
			{name: 'subjectName'}, 
			{name: 'subjectID'}, 
			{name: 'studentName'}, 
			{name: 'studentID'},
			{name: 'level_list'}, // 学生学科初始水平：高中低
			{name: 'wxID'}, //学生家长微信，公众号发模版消息
			
			{name: 'prepaidID'}, //该堂课的知识点归属哪个订单，用于统计课时是否超标购买课时
			{name: 'times'}, //该堂课的知识点归属哪个订单，用于获得购买课时
			
			{name: 'created'}, // sort by
			
			{ name: 'fullDate', convert: function(value, record){
					return record.get('beginTime').substr(2,8)
				} 
			},
			{ name: 'fullEndtime', convert: function(value, record){
					return record.get('endTime')>'1911-01-01'?'':'下课'
				} 
			},
        ]
    }
});