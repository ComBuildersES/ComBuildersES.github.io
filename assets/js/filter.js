

function start() {
  /* All communities cached */
  var communities = [].slice.call(document.querySelector('#content').querySelectorAll('li[data-community]'));
  var lastResult = [];

  function despl (communityName) {
   var offsetFromTop = window.pageYOffset;
   var offsetElem = communities
                        .filter(function(el) {
                            return el.dataset.community === communityName;
                         })[0].offsetTop || 0;
   var diff = offsetFromTop - offsetElem;
   return (-1 * diff) - Math.floor(window.innerHeight / 2);
  }

  function show(communityName) {
   communities
      .map(function(el){
        if(el.dataset.community !== communityName){
          el.classList.toggle('unselected');
        } else {
          el.classList.toggle('selected');
        };
        return true;
      }) && window.scrollBy(0, despl(communityName));
  }

  function cleanString(str) {
    // removed start/end spaces & trailing commas
    return str.trim().replace(/,$/,"");
  }

  function genSourceRe (sourceStr) {
    var cleanedStr = cleanString(sourceStr);
    return /^\w(?:(?:\w+\s?)+,)+/.test(cleanedStr)
      ? "\(" + cleanedStr.split(",").join("|") + "\)"
      : /\w+/.test(cleanedStr)
        ? cleanedStr.replace(/,/g, "").replace(/\s{2,}/g, " ")
        : null;
  }
/*
  function genSourceRe (sourceStr) {
    var cleanedStr = cleanString(sourceStr);
    return /^\w(?:(?:\w+\s?)+,)+/.test(cleanedStr)
      ? "\(" + cleanedStr.split(",").join("|") + "\)"
      : cleanedStr.length > 1 && /\w/.test(cleanedStr)
        ? /\W+/.test(cleanedStr)
          ? cleanedStr.replace(/,/g, "").replace(/\s{2,}/g, " ")
          : cleanedStr
        : null;
  }
*/

  function filter_by_tags(strTags) {
    var groupRe =  genSourceRe(strTags);
    if (groupRe) {
      var re = new RegExp(groupRe + "\[\\s|\|]", "i");
      console.log(re);
      var list = lastResult.length > 0
        ? lastResult
        : communities;
      var result = list
        .map(function(el){
           if(!re.test(el.dataset.tags.split(",").join("|").replace(/\|$/, ""))){
               el.classList.toggle('removed');
           }
           return el;
        })
        .filter(function(elem) {
          return !elem.classList.contains("removed");
        });
      lastResult = result;
      window.scroll(0,0);
    }

  }

  function filter_reset() {
   communities
     .map(
      function(el){
        if (el.classList.contains('unselected')) {
            el.classList.toggle('unselected');
        }
        if (el.classList.contains('removed')) {
            el.classList.toggle('removed');
        }
        return true;
      });
   var previous = document.querySelector('.selected') || null;
   previous && previous.classList.toggle('selected');
   window.scroll(0,0);
   lastResult = [];
  }

  return {
    show: show,
    tags : filter_by_tags,
    reset : filter_reset
  };
}
