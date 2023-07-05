// This code is based on the code available here: https://github.com/hn-88/bloggerToEbook which is
// licensed under "MIT License" .."Copyright (c) 2022 hn-88".
// The details of that license can be viewed here: https://github.com/hn-88/bloggerToEbook/blob/main/LICENSE
// As the license allows others "the rights to use, copy, modify, merge, publish" the software, I have used
// it in my code given below and associated web app.
// The license for this modified version (code below) (modifications done by me, Ravi S. Iyer) is provided
// in my blog post:
// All my blog data and books publicly accessible on Google Drive; Permission for free reuse,
// https://ravisiyer.blogspot.com/p/all-my-blogbooks-publicly-accessible-on.html .
// To know more about how I modified this code and tried it out, please visit my blog post:
// Google Apps Script to Create Blogger Blog Books, Test Version - In Progress Post, 
// https://ravisiyermisc.blogspot.com/2023/06/google-apps-script-to-create-blogger.html ,
// created on 28 Jun 2023.
//
/* I (Ravi S. Iyer) am now an obsolete software developer as I have stayed away from coding for around, if
  not over, a decade now, barring very tiny JavaScript tweaking of others' code to suit my needs. Prior to
  this exploration I had never used Google Apps Script - so the development platform as well as the 
  development environment is new to me. I want to limit the time I spend on this work. So I am looking at
  quick fix modifications to the code which may be bad coding style. I also may not be calling the right API 
  functions or calling them the right way - I just don't have the time to read up on the development 
  platform / API barring just quick viewing of reference pages and help I get from Google Search result 
  links, to figure out what I should try. I am not drastically changing the original code and am trying to 
  stick to its style.  

  I am focusing on modifications for my specific needs and not for any general purpose needs. So my code may 
  have bugs and problems which do not come into play when I am using it for my specific needs but come into 
  play when others use it for different needs. I am not in a position now to help fixing such issues. Other 
  developers are absolutely welcome to do such fixes or other changes and re-publish their version of this 
  software. */

var contenthtml = '';
const DEF_BLOG_URL = 'https://ravisiyermisc.blogspot.com/';
const DEF_BOOK_TITLE = 'BlogBook'; 
const DEF_MAX_POSTS_PER_PART = 50;  // Release version default value
               // Higher default value like 100 results in program run failures at times. Error message
               // usually the following or similar:
               // GoogleJsonResponseException: API call to drive.files.insert failed with error: Bad Request

const DEF_MAX_TOTAL_POSTS = 100;     // Release version default value

function makeBlogBooks(blogurlarg, yr, maxpostsperpart, maxtotalposts, fetchurlmainpart, mainbooktitle) {

  Logger.log("makeBlogBooks arguments: blogurlarg = " + blogurlarg + ", yr = " + yr + ", maxpostsperpart = "
  + maxpostsperpart + ', maxtotalposts = ' + maxtotalposts + ', fetchurlmainpart = ' + fetchurlmainpart
  + ', mainbooktitle = ' + mainbooktitle);

  var apicall;
  var blogurl;
  var maxresults;

  if (maxtotalposts == null)
    maxtotalposts = DEF_MAX_TOTAL_POSTS;

  if (mainbooktitle == null)
    mainbooktitle = DEF_BOOK_TITLE;

  if (fetchurlmainpart == null)
  {
    if (blogurlarg == null)
      blogurl = DEF_BLOG_URL;
    else
      blogurl = blogurlarg;

    if (maxpostsperpart == null)
      maxpostsperpart = DEF_MAX_POSTS_PER_PART;
    
    maxresults = +maxpostsperpart;

    if (maxtotalposts < maxpostsperpart)
      maxtotalposts = maxpostsperpart; 

    if (yr == null)
      apicall = blogurl+'feeds/posts/default'+'?max-results='+ maxresults + '&alt=json';
    else {
      var prevyr = +yr - 1;
      var nextyr = +yr + 1;
      apicall = blogurl+'feeds/posts/default'+'?max-results='+ maxresults + 
      '&published-min=' + prevyr +'-12-31T00:00:00-08:00&published-max='+ nextyr +
      '-01-01T23:59:59-08:00&alt=json'; 
      // Timezone +05:30 trips up the program. I think the + character needs to be escaped but
      // don't know how. So as a hack-fix I am adding a day before min and a day after max
    }
  }
  else {
      apicall = fetchurlmainpart;
      //maxresults has to be extracted from fetchurlmainpart if present, or set to default
      var x = parsemaxresults(fetchurlmainpart);
      if ((x == 0) || isNaN(x) || (x == null))
        maxresults = DEF_MAX_POSTS_PER_PART;
      else 
        maxresults = x;
      
      Logger.log ("After checking for max-results string in fetchurlmainpart, " +
      "maxresults variable set to: " + maxresults);
      
  }
                                 
  var options = {
    method: 'GET',
    muteHttpExceptions: true,
    
  };
  var i = 0; // index of json items in response  
  var postindex = 1; // index of total number of posts in feed, which we fetch maxpostsperpart at a time
                      // Ravi: I think it is a 1 based index used for start_index part of URL
                      // in UrlFetchApp.fetch() call
  var response;
  var loopindex = 1;

   Logger.log("apicall variable = " + apicall);
  do { 
    i = 0;
    response = UrlFetchApp.fetch(apicall+'&start-index='+postindex, options);
    
    var json = JSON.parse(response.getContentText());
    if (json.feed.entry == null) {
      Logger.log("Last UrlFetchApp.fetch() call returned 0 entries. Job is done. " + 
      "Break out of loop to avoid creating empty Google Doc output file.");
      break;
    }
    for ( i in json.feed.entry) {
      var pubdatetime = json.feed.entry[i].published.$t;
      var pubdate = pubdatetime.substring(0,10);
      for (var j = 0; j < json.feed.entry[i].link.length; j++) {
      if (json.feed.entry[i].link[j].rel == 'alternate') {
        break;
        }
      }
      var ListUrl = json.feed.entry[i].link[j].href;
      contenthtml+='<h1>'+json.feed.entry[i].title.$t
            + '; Published: '+pubdate
            +'</h1>'+'Post link (URL) on blog: <a href="' +ListUrl+'">' + ListUrl +'</a>'+'<br/><br/>'
            +json.feed.entry[i].content.$t
            +'<br/>===========================End of Post============================<br/>'
            + '<span style="break-after: always;" />'; //Ravi: Does not create page break in
                                                       // Google Docs document
      Logger.log("Post Title (80 chars), pubdate of this fetch: '" +
      json.feed.entry[i].title.$t.substring(0,80) + "', " + json.feed.entry[i].published.$t) ;
      Logger.log('%s in this fetch, %s overall',(+i+1), (+postindex+(+i)));
    
    }
    postindex = +postindex+(+i)+1; //Ravi: postindex is used for start_index which seems
                                    // to be a 1 based index.
                                    // if maxresults is 10, then for first iteration of fetch which returns
                                    // maxresults, prior to execution of this code statement,
                                    // i will be 9 (as it is a 0 based index) and postindex will be 1.
                                    // After statement execution, postindex will 1+9+1 = 11 which seems to be
                                    // the right value for start_index for next call to fetch to get the
                                    // next set of maxresults posts.

    try {
      var ablob = Utilities.newBlob(contenthtml, MimeType.HTML, "asset.html");
      Logger.log("contenthtml.length = " + contenthtml.length);

      var booktitle;
      if (yr == null)
        booktitle = mainbooktitle +' part '+ loopindex;
      else
        booktitle = mainbooktitle + ', year: ' + yr +', part '+ loopindex;

        var Dx = Drive.Files.insert(
        { title: booktitle, 
        mimeType: MimeType.GOOGLE_DOCS },
        ablob);
      var AssetGDocId = Dx.id;
      Logger.log('Wrote "%s" to GDoc.', booktitle );
    }
    catch(err){
      Logger.log('Error is %s', err);
      return ('Failure to write output Google Docs file. Error Message: ' + err);
    }
    loopindex++;
    contenthtml='';

    if (postindex > maxtotalposts)
    {
      Logger.log('postindex = ' + postindex + ' which is > maxtotalposts = ' + maxtotalposts
       + '. So time to exit loop and finish program run.');
       break;
    }
    
    Logger.log('i value just before while (i>maxresults-2) condition: ' + i +
    ', maxresults = ' + maxresults);
  //} while (i>98); //Ravi: I think it is testing the case where the last
                    // set of results have been returned. Note that earlier max-results was always 100
  } while (i>maxresults-2); //Ravi if maxresults is 4, i will be 3 when it comes to this point  
                            // in first iteration of loop if fetch gives 4 results in first iteration.
                            // But if fetch gives less than 4 results then we know we don't need to call
                            // fetch again. so the test has to be is that so long as i is 3 we can loop back.
                            // To generalize, the test should be while (i==maxresults-1).
                            // The original code uses a slightly different test which should also work of
                            // while (i>98) when max. number of posts requested in the fetch is 100
                            // To use the same style here, the condition has to be:
                            // while (i>maxresults-2) .

  return ("Seems to be successful makeBlogBooks() function invocation. See Execution Log for details.");
}

function parsemaxresults(fetchurlmainpart) {
console.log("parsemaxresults() called with arg = '" + fetchurlmainpart + "'")

var indexOfmaxresults = fetchurlmainpart.indexOf("max-results");
console.log('The index of max-results is ' + indexOfmaxresults);
var maxresultsstr = fetchurlmainpart.substring(indexOfmaxresults);
console.log("maxresultsstr = '" + maxresultsstr +"'");
var indexOfampchar = maxresultsstr.indexOf("&");
if (indexOfampchar == -1) {
  // No & character, so max-results is last parameter
  // But can there be spaces at the end? If so, trim end space part.
  var indexOfspacechar = maxresultsstr.indexOf(" ");
  if (indexOfspacechar == -1) {
    // No space char and maxresultsstr has only max-results parameter
    console.log("No space char and no further parameters, maxresultsstr = '" + maxresultsstr +"'");
  }
  else {
    maxresultsstr = maxresultsstr.substring(0,indexOfspacechar);  
    console.log("No further parameters and after truncating part from first space character, " + 
    "maxresultsstr = '" + maxresultsstr + "'");
  }
}
else {
  maxresultsstr = maxresultsstr.substring(0,indexOfampchar);
  console.log("After truncating part from first & character, maxresultsstr = '" + maxresultsstr+"'");
}
// Now to get the digits or number in max-results parameter
var indexOfeqchar = maxresultsstr.indexOf("=");
if (indexOfeqchar == -1) {
  // error in format of parameter
  console.log("No equal to = character in maxresultsstr = '" + maxresultsstr+"'");
  // abort or give default value to maxresultsnum
}
else {
  maxresultsstr = maxresultsstr.substring(indexOfeqchar+1);
  console.log("After extracting part after = character in maxresultsstr = '" + maxresultsstr+"'");
  var x = parseInt(maxresultsstr);
  if (isNaN(x))
      console.log("The specified parameter is not a number.");
  else 
      console.log("The specified parameter is a number with value = " + x);
}
return (x);
}
