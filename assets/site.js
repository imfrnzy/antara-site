(function(){
  var here = (location.pathname || "/").replace(/\/+$/, "");
  if(here === "") here = "/";
  var links = document.querySelectorAll("[data-nav]");
  links.forEach(function(a){
    var href = (a.getAttribute("href") || "").replace(/\/+$/, "");
    if(href === "") href = "/";
    if(href === here){
      a.setAttribute("data-active","true");
    }
  });
})();
