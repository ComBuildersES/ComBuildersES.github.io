'use strict';

(function($) {
	$.getJSON( 'data/communities.json', function( data ) {
	  var template = $.templates('#itemTmpl');
		var htmlOutput = template.render(data.communities.sort(function(){ return 0.5 - Math.random(); }));
		$('#community-list').html(htmlOutput);
		[].slice.call(document.querySelector('#content').querySelectorAll('.flip-container')).map(function(el) { var aux = el.dataset.tags; el.dataset.tags = aux.toLowerCase().replace(/,$/,""); return el;})

	});
})(jQuery);
