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
// Google Apps Script to Create WordPress Blog Books: In-Progress Test Versions, 
// https://ravisiyermisc.blogspot.com/2023/07/google-apps-script-to-create-wordpress.html ,
// created on 9 Jul 2023.
//
/* I (Ravi S. Iyer) am now an obsolete software developer as I have stayed away from coding for around, if
  not over, a decade now, barring very tiny JavaScript tweaking of others' code to suit my needs. Prior to
  the recent and earlier exploration covered here: Google Apps Script to Create Blogger Blog Books: Test Versions 
  and Stable Version, https://ravisiyermisc.blogspot.com/2023/06/google-apps-script-to-create-blogger.html , I had
  never used Google Apps Script - so the development platform as well as the  development environment is new
  to me. I want to limit the time I spend on this work. So I am looking at quick fix modifications to the code
  which may be bad coding style. I also may not be calling the right API functions or calling them the right way
  - I just don't have the time to read up on the development platform / API barring just quick viewing of
  reference pages and help I get from Google Search result links, to figure out what I should try. I am not
  drastically changing the original code and am trying to stick to its style.  

  I am focusing on modifications for my specific needs and not for any general purpose needs. So my code may 
  have bugs and problems which do not come into play when I am using it for my specific needs but come into 
  play when others use it for different needs. I am not in a position now to help fixing such issues. Other 
  developers are absolutely welcome to do such fixes or other changes and re-publish their version of this 
  software. */


const runType = {
  NORMAL: 1,
  TEST: 2,
};

const thisRun = runType.NORMAL;  // Change to runType.TEST for test run

const testRunPostsLoopIterations = 10; // Used only if thisRun is runType.TEST, otherwise ignored

const DEF_BLOG_FEED_URL = 'https://ravisiyer.wordpress.com/feed/';
const DEF_BOOK_TITLE = 'Blog Feed Book'; 

// In function name below, WP stands for WordPress
function makeWPBlogFeedBook(blogFeedURL, bookTitle) {
  
  Logger.log("makeWPBlogFeedBook arguments: blogFeedURL = " + blogFeedURL + ", bookTitle = " + bookTitle);

  var options = {
    method: 'GET',
    muteHttpExceptions: true,
  };
  
  if (blogFeedURL == null)
    blogFeedURL = DEF_BLOG_FEED_URL;

  if (bookTitle == null)
    bookTitle = DEF_BOOK_TITLE;

  Logger.log("After arguments check for null values, blogFeedURL set to: " + blogFeedURL + ", bookTitle set to: " + bookTitle);

  var xmlFeed = UrlFetchApp.fetch(blogFeedURL, options);    
//  Logger.log("xmlFeed:");
//  Logger.log(xmlFeed);

  var json = XML_to_JSON(xmlFeed); 
//  Logger.log("json:");
//  Logger.log(json);

  var contenthtml = '';
  const now = new Date();
  var timeZone = Session.getScriptTimeZone(); 
  var contentDate = Utilities.formatDate(now, timeZone, 'd-MMM-yyyy\' at \'K:mm a zzzz \'(GMT \'XXX\)');

  contenthtml = '<h1>' + bookTitle + '</h1><br/>';
  contenthtml+= 'Book creation process started on ' + contentDate;

  Logger.log('Book Title and date data (in HTML): ' + contenthtml);

  if (thisRun == runType.NORMAL) {
    Logger.log("Normal run (not test run)");
  } else if (this.Run == runType.TEST) {
    var msg = '<br/><br/><br/><b>Test run with Posts Loop Iterations = ' + 
    testRunPostsLoopIterations + '.</b><br/><br/>';
    contenthtml+= msg;
    Logger.log("(In HTML): " + msg);
  } else {
    Logger.log("Unexpected value for thisRun variable. Aborting function");
    return -1;
  }

  contenthtml += '<br/><br/>Post contents follow:<br/>' +
    '=================================================================';

  for (i in json.rss.channel.item) {
    var pubDateOnly = json.rss.channel.item[i].pubDate.Text.substring(5,16); //0 based start to end, end exclusive
    var ListUrl = json.rss.channel.item[i].link.Text;

    contenthtml+='<h1>'+json.rss.channel.item[i].title.Text
          + '; Published: '+pubDateOnly
          +'</h1>'
          +'Post link (URL) on blog: <a href="' +ListUrl+'">' + ListUrl +'</a>'+'<br/><br/>'
          +json.rss.channel.item[i].encoded.Text
          +'<br/>===========================End of Post============================<br/>';

    Logger.log("Post Title (80 chars), Pub. date: '" +
      json.rss.channel.item[i].title.Text.substring(0,80) + "', " + pubDateOnly) ;

    if (this.Run == runType.TEST) {
      // Test run break
      if (i >= testRunPostsLoopIterations) {
        var msg = "Test run break out of loop of copy of posts data to contenthtml var after " +
          testRunPostsLoopIterations + " loop iterations."
        Logger.log(msg);
        contenthtml+= '<br/><br/><h1>' + msg + '</h1><br/>';
        break;
      }
    }
  }
  
  contenthtml+= '<br/>===========================<b>End of Book</b>============================<br/>';

//  Logger.log("contenthtml:");
//  Logger.log(contenthtml);

  try {
    var ablob = Utilities.newBlob(contenthtml, MimeType.HTML, "asset.html");
    var AssetGDocId = Drive.Files.insert(
      { title: bookTitle, 
      mimeType: MimeType.GOOGLE_DOCS },
      ablob
    ).id;
    Logger.log('Wrote "%s" to GDoc.', bookTitle );
  }
  catch(err){
    Logger.log('Error is %s', err);
    return -1;
  }
  return 0;
}
