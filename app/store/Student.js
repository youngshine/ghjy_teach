// 报读某个学科知识点（subjectID+zsdID)的学生列表，通过的放最后
Ext.define('Youngshine.store.Student', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.Student',
	
    config: {
        model: 'Youngshine.model.Student',
        proxy: {
            type: 'jsonp',
			callbackKey: 'callback',
			url: '',
			reader: {
				type: "json",
				rootProperty: "data"
			}
        },
        sorters: [{ // 最新发布的线路排在顶部，不起作用？
			property: 'pass',
			//direction: "DESC"
		}]
    }
});
