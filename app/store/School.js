Ext.define('Youngshine.store.School', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.School',
	
    config: {
        model: 'Youngshine.model.School',
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
