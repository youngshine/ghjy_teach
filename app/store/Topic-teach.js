// 当堂课教学的题目
Ext.define('Youngshine.store.Topic-teach', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.Topic-teach',
    config: {
        model: 'Youngshine.model.Topic-teach',
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
