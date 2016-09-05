# Inbox
A CS70-specific list of todo-list and task manager. This repository 
contains (1) the generator for the website and (2) the static 
deployment.

created by [Alvin Wan](http://alvinwan.com), Fall 2016

# Usage

To make edits to the website, first run the preview.

    make preview

Then, make edits as necessary. Note that *the preview automatically
re-generates* as anytime you save a file. Once you feel comfortable
with the changes made, deploy to production. 

    make staging m="<message describing change>"

Your edits go live instantaneously.
