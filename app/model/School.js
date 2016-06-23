// 校区列表
Ext.define('Youngshine.model.School', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
			{name: 'schoolID'}, 
			{name: 'schoolName'}, 
			{name: 'district'}, //所在县市区
        ]
    }
});