'use strict';

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

(function($) {
	// $.getJSON( 'data/communities.json', function( data ) {
	//   var template = $.templates('#itemTmpl');
	// 	var htmlOutput = template.render(data.communities.sort(function(){ return 0.5 - Math.random(); }));
	// 	$('#community-list').html(htmlOutput);
	// 	[].slice.call(document.querySelector('#content').querySelectorAll('.flip-container')).map(function(el) { var aux = el.dataset.tags; el.dataset.tags = aux.toLowerCase().replace(/,$/,""); return el;})

	// });

  const spreadsheet = "https://opensheet.elk.sh/18Rf0-3sREFosw__tQYaUmtzJNL3M-PLsm-HIqENf2Yw/Comunidades";
  $.getJSON( spreadsheet, function( data ) {

// debugger
    var template = $.templates('#itemTmpl');
    shuffle(data);
    console.log("Data=",data)
		var htmlOutput = template.render(data);
		$('#community-list').html(htmlOutput);
		[].slice.call(document.querySelector('#content').querySelectorAll('.flip-container')).map(function(el) { var aux = el.dataset.tags; el.dataset.tags = aux.toLowerCase().replace(/,$/,""); return el;})


  });
  
})(jQuery);
