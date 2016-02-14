'use strict';

(function($) {

	$.getJSON( 'data/communities.json', function( data ) {

	  var template = $.templates('#itemTmpl');
		var htmlOutput = template.render(data.communities.sort(function(){ return 0.5 - Math.random(); }));
		$('#community-list').html(htmlOutput);

	});




})(jQuery);
