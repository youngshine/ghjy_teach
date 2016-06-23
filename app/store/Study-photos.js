Ext.define('Youngshine.store.Study-photos', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.Study-photos',
	
    config: {
        model: 'Youngshine.model.Study-photos',
        proxy: {
            type: 'jsonp',
			callbackKey: 'callback',
			url: '',
			reader: {
				type: "json",
				rootProperty: "data"
			}
        },
		groupField: 'fullCreated',
        groupDir: 'DESC',
		grouper: {
            sortProperty: 'fullCreated',
            groupFn: function(record) {
                //return record.get('Mode')==0?'单次拼车':'定期拼车';
            }
        },

    }
});
