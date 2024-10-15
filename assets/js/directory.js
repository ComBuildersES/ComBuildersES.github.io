'use strict';
let filter = null;
let value = null;
let communities = null;
$(document).on('click', '.dropdown-menu label', function (e) {
  e.stopPropagation();
  
  if(e.target.querySelector("input")){
    // console.log(`${e.target.innerText}=${e.target.querySelector("input").checked}`)
    filter = e.target.parentElement.parentElement.dataset.filter;
    value = e.target.innerText;
  }else{
    const show = e.target.checked;
    filterCards(filter, value, show);
  }
});

function filterCards(filter, value, show){
  document.querySelectorAll(`.flip-container[${filter}="${value}"]`).forEach(e=>{
    e.style.display = show? "flex": "none";
  });
  let visible = communities.filter(e=>e.style.display !== "none").length
  document.getElementById("counter").innerText = visible
}

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
    
    var template = $.templates('#itemTmpl');
    shuffle(data);
    console.log("Data=",data)
		var htmlOutput = template.render(data);
		$('#community-list').html(htmlOutput);
		[].slice.call(document.querySelector('#content').querySelectorAll('.flip-container')).map(function(el) { var aux = el.dataset.tags; el.dataset.tags = aux.toLowerCase().replace(/,$/,""); return el;})
    
    document.getElementById("counter").innerText = data.length
    initApp()
  });

  function initApp(){
    communities = [...document.querySelectorAll('.flip-container')]
    //data = data.filter(e => e.Estado == "Activa");
    filterCards("data-estado", "Inactiva", false);
    filterCards("data-estado", "Desconocido", false);
  }
  
})(jQuery);
