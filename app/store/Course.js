Ext.define('Youngshine.store.Course', {
    extend: 'Ext.data.Store',
	
	requires: 'Youngshine.model.Course',
	
    config: {
        model: 'Youngshine.model.Course',
        proxy: {
            type: 'jsonp',
			callbackKey: 'callback',
			url: '',
			reader: {
				type: "json",
				rootProperty: "data"
			}
        },

    }
});
