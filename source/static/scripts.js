// Piwik/Matomo
var _paq = _paq || [];
_paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
_paq.push(["setCookieDomain", "*.openfisca.org"]);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
  var u="//stats.data.gouv.fr/";
  _paq.push(['setTrackerUrl', u+'piwik.php']);
  _paq.push(['setSiteId', '4']);
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
})();

function getPathName() {
  if (location.pathname.startsWith('/doc/')) { // Very ugly. Triggered when the doc is hosted under the /doc/ subdomain. A proper configuration system would be preferable.
    return '/doc';
  }
  return '';
}

$(document).ready(function() {

  $('a[href^="https://"], a[href^="http://"]').attr("target", "_blank"); // Make all external links open in a new Window

  // Internal docs containing an anchor are wrongly transpiled to an absolute link starting by '/'. This causes dead links when we serve under openfisca.org/doc. The following manually fix these links in JS. This could be avoided if we served on doc.openfisca.org
  $( "a[href^='/']" ).attr("href",
    function( _, href ) {
      return getPathName() + href;
    }
  );

  $( "img[src^='/']" ).attr("src",
    function( _, src ) {
      return getPathName() + src;
    }
  );

  // Activate action button tooltip
  $('.actionbutton').tooltip()
});



// try to add feedback js

$('body').on('click', 'img', function(){
  if ($(this).hasClass('selected')) {
    $('img').removeClass('selected sibling-selected');
    $(this).siblings('textarea').removeClass('visible')
  } else {
    $('img').removeClass('selected sibling-selected');
    $(this).addClass('selected');
    $(this).siblings('img').addClass('sibling-selected');    
    $(this).siblings('textarea').addClass('visible')
  }
})

$('body').on('mouseover', 'img', function(){
  $(this).siblings('img').addClass('sibling-hover');
})

$('body').on('mouseout', 'img', function(){
  $(this).siblings('img').removeClass('sibling-hover');
})

