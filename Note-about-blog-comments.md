RI notes:

Explored RSS feed for comments and pages and found that for blogger the following works:

https://ravisiyermisc.blogspot.com/feeds/pages/default

https://ravisiyermisc.blogspot.com/feeds/comments/default

That solves the issue for adding pages content to your GAS project if anybody needs it.
For comments, the issue is that, in RSS too, the comments are listed separately and while they mention the associated post link (url), the post data itself is not provided. What I need in my blog book is for comments to appear after the post in which the comments are made.

So if in your GAS project using RSS feed in json to create blog books, you need to add comments immediately after the post is output, then you too would need something like a dictionary object holding all comments for a post (built as part of preparation for main blog book creation), and then as the post is output, check the dictionary object for whether the post has comments, and if so, output it.
