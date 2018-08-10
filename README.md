# Mongo Scraper

Mongo Scraper is a student project article scraping application using mongoDb and Axios.

Mongo Scraper pulls from [Wired Magazine's](https://www.wired.com/) most recent articles page
and pulls out the link, image, header, and description. On page load the user is greated to 
a blank canvas and two horizontal side buttons, scrape articles and saved articles.
If the user presses scrape articles the application will scraped Wired and populate the page
with floating cards for each articles found. The card can be moved around freely within the webpages
body. Each articles also has a save button, that when clicked pushes the article information into a 
MongoDb database.

When the user clicks "Saved Articles", the the database is queried and the page is populated with each
saved article. These saved articles now have a delete ("X") button and an update button.

The update button allows the user to save a note on the article. The card switches to a form with the article
header, twoinput boxes, and a save button. When the user clicks the save button the note is saved in a separate MongoDb 
collection and is referenced to the article it was saved on. When the user clicks update again the article header
and its referenced note text populate the card.

