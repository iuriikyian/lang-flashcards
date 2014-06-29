define(['Menu'], function(menu){
	var TAP_EVENT = 'click';

	return {
		menu : {
			view : menu,
			options : {
				el : '#menu',
				overlay : '#overlay',
				tapEvent : TAP_EVENT
			}
		}
	};
});