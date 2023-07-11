// This file has various invocations of makeWPBlogFeedBook() function which can be run from Script Editor
// The parameters of makeWPBlogFeedBook() can be made out from the parameter names in function prototype below
  // function makeWPBlogFeedBook(blogFeedURL, bookTitle)

// The license for the code in this file (code below) (authored by me, Ravi S. Iyer) is provided
// in my blog post:
// All my blog data and books publicly accessible on Google Drive; Permission for free reuse,
// https://ravisiyer.blogspot.com/p/all-my-blogbooks-publicly-accessible-on.html .


// In function names below BFB is acronym for Blog Feed Book.
// Note that number of posts in feed for a WordPress blog is controlled by
// WordPress Admin->Settings->Reading->Syndication feeds for that blog and has default value of 10.
// As far as I know, number of posts cannot be specified as a parameter while making the blog feed request.
// I have been able to change WordPress Admin->Settings->Reading->Syndication feeds for one of my
// WordPress blogs to 150 after which the feed request seems to have returned all 113 published posts
// of that blog.


// Invokes makeWPBlogFeedBook with default values which will make a book of the default blog feed 
// This function can be run from Script Editor to test makeWPBlogFeedBook function.
function makeBFBWithDefaultValues() {
  makeWPBlogFeedBook(null, null);
}

// Invokes makeWPBlogFeedBook for ravisiyer.wordpress.com full blog
// Requires WordPress Admin->Settings->Reading->Syndication feeds to be set to higher than number
// of published posts in ravisiyer.wordpress.com. As of 10 Jul 2023, number of published posts
// in that blog is 113 and so 150 is a good value for Syndication feeds. I checked that 150 value is
// accepted by WordPress and that the WordPress feed seems to return all 113 posts.
function makeRavisiyerWPBlogBook() {
  makeWPBlogFeedBook('https://ravisiyer.wordpress.com/feed/', "ravisiyer.wordpress.com Blog Feed Book");
}

// Invokes makeWPBlogFeedBook for a particular blog feed (for a year)
function makeBFBForOneYear() {
  makeWPBlogFeedBook('https://ravisiyer.wordpress.com/2022/feed/', "ravisiyer.wordpress.com - Year 2022 Blog Feed Book");
}

// Invokes makeWPBlogFeedBook for a particular blog feed with year parameter in a loop.
function makeBFBYearWise() {
  var year;
  const blogURL = 'https://ravisiyer.wordpress.com/';
  const blogFeedBookTitleBase = 'ravisiyer.wordpress.com';

  var blogFeedURL = '';
  var blogFeedBookTitle = '';
  var rtnCode;
  for(year = 2023; year > 2010; year--){
    blogFeedURL = blogURL + year + '/feed/' ;
    blogFeedBookTitle = blogFeedBookTitleBase + ' - Year ' + year + ' Blog Feed Book';
    rtnCode=makeWPBlogFeedBook (blogFeedURL, blogFeedBookTitle); 
    if (rtnCode == 0) {
      Logger.log("Successfully returned from makeWPBlogFeedBook() for parameters: " + blogFeedURL +", " +       
        blogFeedBookTitle);
    } else {
      Logger.log ("Failure return from makeWPBlogFeedBook() for parameters: " + blogFeedURL +", " +           
        blogFeedBookTitle);
      Logger.log("Aborting!");
      return;
    }
  }
}
