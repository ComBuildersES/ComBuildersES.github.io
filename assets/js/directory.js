'use strict';

(function($) {

	$.getJSON( 'data/communities.json', function( data ) {
	  //var items = [];
	  /*$.each( data.communities, function( key, val ) {
	    items.push( '<li id="' + key + '">' + val.name + '</li>' );
	  });*/
	 
	  var template = $.templates('#itemTmpl');

		var htmlOutput = template.render(data.communities);

		$('#content').html('<ul>'+htmlOutput+'</ul>');
	  /*$( '<ul/>', {
	    'class': 'my-new-list',
	    html: items.join( '' )
	  }).appendTo( '#content' );*/
	});

	
	

})(jQuery);