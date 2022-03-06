var blogurl = 'https://sathyasaiwithstudents.blogspot.com/';
var todatestring = '';
var fromdatestring = '';
var desiredebooktitle = 'Conversations Sathya Sai with Students';
//var publishedstr = "start_published_date:"+fromdatestring+" end_published_date:"+todatestring;
var publishedstr = '';

var searchlabel = "3.%20Conversations";
//searchyear = '2013';
// https://support.google.com/blogger/thread/70915561/listing-posts-by-date?hl=en
//var publishedstr = "start_published_date:"+searchyear+"-01-01 end_published_date:"+searchyear+"-12-31";
var contenthtml = '';

function myFunction() {
  //var apicall = 'https://www.googleapis.com/blogger/v3/blogs/5798284702978563677/posts/search?q=label:2.%20Experiences%20of%20Students';
  // did not work, so 
  // https://stackoverflow.com/questions/41710466/blogger-api-search-using-labels
  // https://stackoverflow.com/questions/24348328/blogger-json-feed-api-more-than-500-posts
  // &max-results=99999&start-index=501
  var apicall = blogurl+'feeds/posts/default/-/'+searchlabel+'?max-results=100&alt=json&'+publishedstr;
  
  var options = {
    method: 'GET',
    muteHttpExceptions: true,
    
  };
  var i = 0; // index of json items in response  
  var postindex = 1; // index of total number of posts in feed, which we fetch 100 at a time
  var response;
  var loopindex = 1;
  do {
    i = 0;
    response = UrlFetchApp.fetch(apicall+'&start-index='+postindex, options);
    //Logger.log('query=%s, resp code=%s', apicall+'&start-index='+postindex, response.getResponseCode());
    
    var json = JSON.parse(response.getContentText());
    // https://www.mybloggertricks.com/2015/10/create-recent-posts-widget-using-JSON-feed.html
    // https://stackoverflow.com/questions/2808652/how-to-implement-page-break-in-epub-reader
    for ( i in json.feed.entry) {
      contenthtml+='<h1>'+json.feed.entry[i].title.$t
            +'</h1>'+json.feed.entry[i].content.$t
            + '<span style="page-break-after: always" />';
      Logger.log('%s in this fetch, %s overall',(+i+1), (+postindex+(+i)));
    
    }
    //update postindex - the +1 is because i is zero-indexed while postindex is not.
    postindex = +postindex+(+i)+1; 
    // the + in front of variable to force it to number and not string
    // https://stackoverflow.com/questions/10080030/javascript-is-treating-variables-as-strings-why

    try {
      var ablob = Utilities.newBlob(contenthtml, MimeType.HTML, "asset.html");
      var AssetGDocId = Drive.Files.insert(
        { title: desiredebooktitle+' part '+ loopindex, 
        mimeType: MimeType.GOOGLE_DOCS },
        ablob
      ).id;
      Logger.log('Wrote the file to GDoc.');
    }
    catch(err){
      Logger.log('Error is %s', err)
    }
    loopindex++;
    contenthtml='';
    
  } while (i>2);  
  
}
