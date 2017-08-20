
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address=streetStr+','+cityStr;

    $greeting.text("so,you want to live at "+address+"?");

    var streetviewUrl='http://maps.googleapis.com/maps/api/streetview?size=600x400&location='+address+'';
    $body.append('<img class="bgimg" src="'+streetviewUrl+'">');

    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q='+cityStr+'&sort=newest&api-key=44e790d220fc4c9981efcaa34fdf4e69';


    $.getJSON(nytimesUrl,function(data){
         $nytHeaderElem.text("New York Times articles about "+cityStr);
         articles = data.response.docs;
              for(i=0;i<articles.length;i++)
              {
              var article=articles[i];
              $nytElem.append('<li class="article">'+
                             '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                             '<p>'+article.snippet+'</p>'+
                             '</li>'
                             );
              };



              }).error(function(e){
                       $nytHeaderElem.text("Could not be loaded")
                       });

    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+cityStr+'&imlimit=5&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
                                        $wikiElem.text("failed to load the page");
                                        },8000);

    $.ajax({
           url : wikiUrl,
           dataType:"jsonp",
           success:function(response){

           var articleList = response[1];
           for(var i=0;i<articleList.length;i++)
           {
           articleStr=articleList[i];
           var url="http://en.wikipedia.org/wiki/"+articleStr;
           $wikiElem.append('<li><a href="'+url+'">'+articleStr+'</a></li>');
           };
           clearTimeout(wikiRequestTimeout);
           }
           });


    return false;
};


$('#form-container').submit(loadData);
