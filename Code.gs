searchlabel = "2.%20Experiences%20of%20Students";
searchyear = '2013';
// https://support.google.com/blogger/thread/70915561/listing-posts-by-date?hl=en
publishedstr = "start_published_date:"+searchyear+"-01-01 end_published_date:"+searchyear+"-12-31";
contenthtml = '';

function myFunction() {
  //var apicall = 'https://www.googleapis.com/blogger/v3/blogs/5798284702978563677/posts/search?q=label:2.%20Experiences%20of%20Students';
  // did not work, so 
  // https://stackoverflow.com/questions/41710466/blogger-api-search-using-labels
  // https://stackoverflow.com/questions/24348328/blogger-json-feed-api-more-than-500-posts
  // &max-results=99999&start-index=501
  var apicall = 'https://sathyasaiwithstudents.blogspot.com/feeds/posts/default/-/2.%20Experiences%20of%20Students?max-results=150&alt=json&start-index=251';
  var headers = {
    //Authorization: 'Bearer ' + getService().getAccessToken(),
    //https://github.com/googleworkspace/apps-script-samples/issues/121
    Authorization: "Bearer " + ScriptApp.getOAuthToken(),
  };

  Logger.log(ScriptApp.getOAuthToken())

  var options = {
    headers: headers,
    method: 'GET',
    muteHttpExceptions: true,
    
  };

  var response = UrlFetchApp.fetch(apicall, options);

  Logger.log(response.getResponseCode());
  //Logger.log(response.getContentText());

   var json = JSON.parse(response.getContentText());
   // https://www.mybloggertricks.com/2015/10/create-recent-posts-widget-using-JSON-feed.html
   // https://stackoverflow.com/questions/2808652/how-to-implement-page-break-in-epub-reader
   for (var i in json.feed.entry) {
     contenthtml+='<h1>'+json.feed.entry[i].title.$t+'</h1>'+json.feed.entry[i].content.$t+ '<span style="page-break-after: always" />';
     Logger.log(i);
    
    // for (var j = 0; j < json.feed.entry[i].link.length; j++) {       
    //   if (json.feed.entry[i].link[j].rel == 'alternate') {       
    //     break;       
    //   }       
    // } 
    //var ListUrl= "'" + json.feed.entry[i].link[j].href + "'"; 

    //Logger.log('i=%s [%s]  %s', i, json.feed.entry[i].title.$t,  ListUrl);     


  }
  // var assethtml = json.content;
  // https://developers.google.com/drive/api/v2/reference/files/list#java 
  // gives the technique of looping over request.getPageToken

  //var assethtml = "<p>This is html</p>";
  try {
    var ablob = Utilities.newBlob(contenthtml, MimeType.HTML, "asset.html");
    var AssetGDocId = Drive.Files.insert(
      { title: 'Experiences of students - part 3', 
      mimeType: MimeType.GOOGLE_DOCS },
      ablob
    ).id;
    Logger.log('Wrote the file to GDoc.');
  }
  catch(err){
    Logger.log('Error is %s', err)
  }
  
}
