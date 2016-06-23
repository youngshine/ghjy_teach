// 当堂课教学过程图片，最多3张？
Ext.define('Youngshine.model.Study-photos', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
			{name: 'studyphotoID'}, 
			{name: 'studentstudyID'}, //学生报读知识点记录，包括student+zsd 
			{name: 'photo'}, 
			{name: 'created', type: 'date',dateFormat: 'c' }, //排序用
			
			// 日期，分组，created过来已经是datetime格式?
			{ name: 'fullCreated', convert: function(value, record){
					var date = record.get('created');
					return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
				} 
			}, 
        ]
    }
});