# bloggerToEbook
Script to convert a set of blog posts on a blogger.com blog to a Google Document, which can then be downloaded as an EPUB ebook.

This is implemented as a Google Apps Script for simplicity. The blogurl, todatestring, fromdatestring, label etc to be changed as needed. This script is able to convert 100+ posts, which with images becomes ~50MB, into a single GDoc without any problems in around a minute. 

ravisiyer has implemented a javascript version of this, without Google Apps script. https://raviswdev.blogspot.com/2024/03/notes-on-bypassing-cors-in-javascript.html

**References**:
1. https://www.google.com/search?q=google+apps+script+site%3Ahnsws.blogspot.com
2. https://www.mybloggertricks.com/2015/10/create-recent-posts-widget-using-JSON-feed.html
3. https://stackoverflow.com/questions/24348328/blogger-json-feed-api-more-than-500-posts
