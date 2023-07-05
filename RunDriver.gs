// This file has various invocations of makeBlogBooks() function which can be run from Script Editor
// The parameters of makeBlogBooks() can be made out from the parameter names in function call code below
  //var funcReturnMsg = makeBlogBooks(blogurlparm, year, maxpostsperpart, maxtotalposts,
  // fetchurlmainpart, mainbooktitle);

// The license for the code in this file (code below) (authored by me, Ravi S. Iyer) is provided
// in my blog post:
// All my blog data and books publicly accessible on Google Drive; Permission for free reuse,
// https://ravisiyer.blogspot.com/p/all-my-blogbooks-publicly-accessible-on.html .

// Initially I had tried to use web app deployment and pass parameters through query string to
// the main function (now called makeBlogBooks). But I faced some unusual issues which led me to
// take the decision to drop the web app approach. However, I plan to document the code I had written
// for the web app implementation as well as the issues I faced in my blog post:
// Google Apps Script to Create Blogger Blog Books, Test Version - In Progress Post, 
// https://ravisiyermisc.blogspot.com/2023/06/google-apps-script-to-create-blogger.html ,
// created on 28 Jun 2023. You may visit that post to check that code and issues out. Readers are 
// welcome to fix the issues and make the web app deployment stable and share that freely with others.


// Invokes makeBlogBooks (MBB) for a particular blog for a particular year with default value of posts
// per blog book part (may be 50) and max of 400 posts for that year.
// I think this function will not encounter execution time limits for most blogs and so is safe to run
// To run it for a different blog and year, simply change the parameters in the single function call code
// below: 1st parameter - blog url, 2nd parameter - year, 4th parameter need not be changed unless blog 
// has more than 400 posts for that  year, 6th parameter - main part of blog book title
function makeBlogBooksForOneYear() {
    var funcReturnMsg = makeBlogBooks("https://ravisiyer.blogspot.com/", 2023, null, 400, null,
    "ravisiyer.blogspot.com"); 
  Logger.log(funcReturnMsg);
}

// Invokes makeBlogBooks (MBB) with default values which will print the default blog but limit
// limit number of posts printed to default max total posts (which may be 200)
// This function can be run from Script Editor to test MBB function.
function invokeMBBWithDefaultValues() {
  var funcReturnMsg = makeBlogBooks(null, null, null, null, null, null);
  Logger.log(funcReturnMsg);
}

// Invokes makeBlogBooks (MBB) for my spiritual blog with year parameter in a loop.
// In past runs, the function has timed out due to execution timing out (crossing some execution time limit
// I guess) and so had to have an additional run for the remaining part of the blog (comments below have
// details of that) with first run code commented out.
function makeMySpiritualBlogBooksYearWise() {
  var year;
  var funcReturnMsg;

  /*for(year = 2023; year > 2012; year--){
    funcReturnMsg = makeBlogBooks("https://ravisiyer.blogspot.com/", year, null, 400, null, "ravisiyer.blogspot.com"); 
    Logger.log(funcReturnMsg);
  }*/
  // 4 Jul 2023: Above code produced blog books from 2023 to 2016 - need to check them out.
  // Execution timed out after 2015 part 1 before completion of part 2 though part 2 file also was created.
  // So code below starts from 2015 counting down. To prevent confusion I deleted 2015 parts 1 & 2 files
  // of above run.

  for(year = 2015; year > 2012; year--){
    funcReturnMsg = makeBlogBooks("https://ravisiyer.blogspot.com/", year, null, 400, null, "ravisiyer.blogspot.com"); 
    Logger.log(funcReturnMsg);
  }
  // 4 Jul 2023: Above code produced blog books from 2015 to 2013 - need to check them out. Program completed
  // normally as blog starts from year 2013.
}
