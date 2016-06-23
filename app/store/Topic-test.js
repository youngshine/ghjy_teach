// 当堂课教学的考试题目
Ext.define('Youngshine.store.Topic-test', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.Topic-test',
    config: {
        model: 'Youngshine.model.Topic-test',
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
			property: 'created',
			direction: "DESC"
		}]
    }
});
