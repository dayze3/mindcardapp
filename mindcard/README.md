# Mindcard
#### Video Demo:  <URL HERE>
#### Final Product: <https://mindcardapp.herokuapp.com/>

## Why did I build this?

My initial vision was to build a flashcard maker that could also display information as a mind map (hence the name Mindcard). This project is the first step to making that idea a reality.

## What does it do?

### Accounts

Each user has their own unique account. Creating an account requires them to enter their email, username, and password. They will also be required to confirm their password by retyping it. The original password and retyped password must match in order for the account to be created. If the user already has an account, they can log in by entering their username and password.

### Homepage

Once the user creates an account or logs in, they will automatically be redirected to the homepage. The navigation bar on top contains a button to create a new deck. Decks the user has already created will be displayed as cards in a grid. Hovering over or swiping horizontally on the card will flip it, revealing the date and time the deck was created and last modified. Clicking on the card will allow the user to edit the contents of the card.

### Editing decks and cards

Each deck can be renamed by clicking on its card in the homepage, then clicking the pencil icon underneath the deck's name. Deleting a deck requires clicking the trash icon beneath the deck's name. Clicking the "Add Card" button will create an new card with a front, back, and order. The order of the cards in a deck is determined by the number in the order field (the first card is 1, the second card is 2, and so on). Users can edit a card by clicking the pencil icon on the right of a card and delete it by clicking the trash icon next to the pencil.

### Studying cards

Clicking the "Study" button underneath a deck's name will allow a user to view each of their cards one by one. Clicking the card or pressing the space, up, or down key will flip the card. Clicking the left and right arrows, swiping left and right on the card, or pressing the left and right arrow keys will navigate between the cards. Pressing 1 or clicking "Study Again" will allow the user to see the card again during the session, while pressing 2 or clicking "Got It" means that the user does not need to see the card again and it will not reappear. The "Back" button takes the user back to the deck page where they can edit their cards, and the "Settings" button allows the user to shuffle the cards or show the back of the card first. Once the user finishes studying the deck (by marking all of the cards as "Got It"), a button that says "Study Again" will appear.

## How did I build this?

### Softwares/Languages Used

I used Python/Django for the back end, Heroku for production, PostgreSQL for the database, and HTML, CSS, and Javascript for the front end. I also used JQuery, Bootstrap, and the Javascript cookie library. 

### Front End

#### HTML Files

My layout.html file imports the libraries I used and includes the favicon, navigation bar, and create deck modal. All of my other HTML files extend this template. The register.html file and login.html file also include Javascript and JQuery for setting custom error messages when certain fields are not filled in properly. Almost all of the forms are Django forms sent from the backend. I used load static for the static files.

#### Javascript Files

The deck.js file includes the Javascript and JQuery for renaming and deleting cards and decks, since I used Ajax to prevent a reload every time a change was made. The index.js file includes the Javascript and JQuery for the flipping cards on the home screen and formatting the timestamps for when the deck was created and modified. The study.js file includes the Javascript and JQuery for putting together the list of cards from the information sent by the backend, flipping the cards, navigating between the cards, setting the order of the cards (depending on if the deck is shuffled or not), and marking cards as "Got It" or "Study Again".

#### Other Static Files

The styles.css file contains the styling for all of the pages. I used variables for the colors, media queries to determine screen width, and repeat, autofill, and minmax for the grids. I also used transform for the flipping cards on the home page and study page. The logo on the navigation bar and favicon are both .jpg files.

### Back End

#### Views.py

All of the views except login and register have @login_required, so attempting to access any of them while not logged in will redirect the user to the login page. All of the views that don't have a corresponding HTML file are only there to process Ajax requests and will redirect to the deck view if they are accessed. The only exception is the deck view itself, which is used for creating new cards as well as rendering deck.html.

#### Models.py

Each deck links to a user with a foreign key and includes a name, date and time created, and date and time last modified. Both of the DateTimeFields are filled in automatically. Each card links to a deck with a foreign key and includes a front, back, and order. The front and back must each be less than 280 characters. Each user is stored using Django's default user model.

#### Forms.py

Almost all of the forms used in this website are Django forms. DeleteDeck and DeleteCard are not visible but send the item's ID from the front end to the back end so the system knows which deck or card to delete. The ID and class(es) of each field are also defined here when necessary.

#### Urls.py

The urls.py file under the mindcard folder includes the urls.py file under the mindcardapp folder. The file under the mindcardapp folder defines the paths for the website.

#### PostgreSQL

All data, including the users, decks, and cards, is stored in a Heroku PostgreSQL database.