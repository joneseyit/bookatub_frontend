const baseUrl = "http://localhost:3000/api/v1/"
const listingsUrl = `${baseUrl}listings`
const reservationsUrl = `${baseUrl}reservations`
const usersUrl = `${baseUrl}users`

let currentlyLoggedIn = false
let currentListings = []
let allReservations = []
let usersList = []
let loggedInUser = ''
let listingList

document.addEventListener('DOMContentLoaded', () => {
  fetch(usersUrl)
    .then(response => response.json())
    .then(json => createUsers(json))
    .then(fetch(reservationsUrl)
      .then(response => response.json())
      .then(json => createReservations(json)))
    .then(fetch(listingsUrl)
      .then(response => response.json())
      .then(json => renderHomepage(json)))

    // debugger;
  listingList = document.getElementById('list-o-cards')
  logInButton = document.getElementById('login-btn')
  userButton = document.getElementById('user-btn')
  aboutButton = document.getElementById('about-btn')
  logOutButton = document.getElementById('logout-btn')
  homeButton = document.getElementById('home-btn')
  logInButton.addEventListener('click', () => {
    handleLogInClick();
  })
  homeButton.addEventListener('click', () => {
    deleteEntirePage();
    showHomePage();
    createHTMLListings()
  })
  aboutButton.addEventListener('click', () => {
    handleAboutClick();
  })
  logOutButton.addEventListener('click', () => {
    loggedInUser = ''
  })
  userButton.addEventListener('click', () => {
    // removeElementsForListingShow()
    deleteEntirePage()
    renderUserShowPage()
    // debugger;
  })

});//end of DOMContentLoaded

function createReservations(json){
  json.forEach(element => {
    let newReservation = new Reservation(element.guest_id, element.listing_id, element.dateTime)
    allReservations.push(newReservation)
  })
}
function createUsers(json){
  json.forEach(element => {
    let newUser = new User(element.id, element.username, element.password, element.age, element.location)
    usersList.push(newUser)
  })
}

function renderHomepage(json){
  createListingsFromJson(json)//creates all Listing objects and stores them in currentListings
  deleteEntirePage();
  showHomePage();
  createHTMLListings()
}

function createListingsFromJson(json){
  json.forEach(element => {
    let newListing = new Listing(element.id, element.host_id, element.name, `${element.picture}.jpg`, element.description, element.location)
    currentListings.push(newListing)
  })
}

function renderUserShowPage(){
  let thisUser = usersList.find(k=> k.username == loggedInUser)

  newH1 = document.createElement('h1')
  newH1.innerHTML = `${loggedInUser.charAt(0).toUpperCase() + loggedInUser.slice(1)}'s Page`
  document.getElementById('entire-page').appendChild(newH1)

  listingsHeader = document.createElement('h3')
  listingsHeader.innerHTML = "Upcoming Listings"
  document.getElementById('entire-page').appendChild(listingsHeader)


  listingHolder = document.createElement('div')
  listingHolder.setAttribute("class", "ui three column grid")
  //get Listings
  theseListings = currentListings.filter(l=> l.host_id == thisUser.id)
  theseListings.forEach(element=>{
    listingHolder.innerHTML += `<div class="column">
    <div class="ui fluid card">
      <div class="image">
        <img src='${element.picture}'>
      </div>
      <div class="content">
        <a class="header">'${element.name}'</a>
      </div>
    </div>
  </div>`
  })
  document.getElementById('entire-page').appendChild(listingHolder)

  //get Reservations


  //create something to hold listings
  //create something to hold reservations
  reservationsHeader = document.createElement('h3')
  reservationsHeader.innerHTML = "Upcoming Reservations"
  document.body.appendChild(reservationsHeader)


  reservationHolder = document.createElement('div')
  reservationHolder.setAttribute("class", "ui three column grid")
  //get Listings
  theseReservations = allReservations.filter(l=> l.guest_id == thisUser.id)

  theseReservations.forEach(element=>{
    //get listing for reservation
    thisListing = currentListings.find(l=> l.id == element.listing_id)
    //get host
    thisHost = usersList.find(l=> l.id == thisListing.host_id)
    // debugger;
    reservationHolder.innerHTML += `<div class="column">
    <div class="ui fluid card">
    <div class="image">

    </div>
    <div class="content">
    <a class="header">'${thisHost.username}'</a>
    </div>
    </div>
    </div>`
  })
  document.body.appendChild(reservationHolder)


}

function createHTMLListings(){
  currentListings.forEach(element => {
    createListingElementAndAppend(element)
  })
}

function createListingElementAndAppend(singleListing){
  var temp = document.createElement('div')
  temp.setAttribute("class", "ui card");
  let text = `<div class="image">
    <img src="${singleListing.picture}">
  </div>
  <div class="content">
    <div class="header">${singleListing.name}</div>
    <div class="meta">
      <a>Friends</a>
    </div>
    <div class="description">
      ${singleListing.description}
    </div>
  </div>
  <div class="extra content">
    <span class="right floated">
      ${singleListing.location}
    </span>
    <span>
      <i class="user icon"></i>
      ${usersList.find(k=> k.id == singleListing.host_id).username}
    </span>
  </div>`

  temp.innerHTML = text
  temp.setAttribute('data-id', singleListing.id)
  temp.addEventListener('click', function(e){ handleListingClick(e.currentTarget.dataset.id)})
  document.getElementById('list-o-cards').appendChild(temp)
}

function handleAboutClick(){
  deleteEntirePage()
  // console.log('About')
  text = `<div class="ui text container" style="text-align:center; margin: 10em;" id="index-text">
    <h1>About Book-a-Tub</h1>
    <h2 style="color: gray;">Book-a-Tub is here to facilitate all of your tub needs.  Whether it's
    a bath tub, hot tub, or even a swimming pool.  Book-a-Tub is here to help.</h2>
  </div>`
  document.getElementById('entire-page').innerHTML = text
}

function handleLogInClick(){
  //check to see what page we are coming from, handle accordingly
  deleteEntirePage()
  renderSignIn()
}


function renderSignIn(){

  var text = `<form class="ui form">
    <div class="field">
      <label>Username</label>
      <input type="text" name="first-name" placeholder="First Name" id='username-text'>
    </div>
    <button class="ui button" type="submit" id= "login-submit">Submit</button>
    <button class="ui button" id= "back-btn">Cancel</button>
  </form>`
  let signEl = document.createElement('div')
  signEl.setAttribute("class", "ui text container")
  signEl.setAttribute("id", "login-form")
  signEl.setAttribute("style", "width:30%;margin: 2em auto;")
  signEl.innerHTML = text
  document.getElementById('entire-page').appendChild(signEl)
  document.getElementById('back-btn').addEventListener('click', function(e){
    e.preventDefault
    console.log('back')
    handleBackFromSignIn();

  })

  document.getElementById("login-submit").addEventListener('click', function(e) {
    e.preventDefault();

    console.log('submit')
    loggedInUser = document.getElementById("username-text").value
    handleBackFromSignIn()
  })
}

function handleBackFromSignIn(){
  deleteEntirePage();
  // reRenderHome();
  showHomePage();
  createHTMLListings()
  console.log(loggedInUser)
}

function handleListingClick(listingID){
  var temp = currentListings.find(x => x.id == listingID)
  deleteEntirePage()
  loadListingShowPage(temp)
  var btn = document.getElementById('home-button')
  btn.addEventListener('click', function (){
    removeListingLoadHome();
  })
}

function removeListingLoadHome(){
  deleteEntirePage();
  showHomePage()
  createHTMLListings();
}

function loadListingShowPage(listing){
  var temp = document.createElement('div')
  temp.setAttribute("class", "ui container")
  temp.setAttribute("id", "listing-card")
  temp.setAttribute("style", "height: 50%; width: 80%;margin: 2em auto; padding-left: 2em;")
  //<div class="ui container" style="height: 50%; width: 80%;margin: 2em auto; padding-left: 2em;">
  let text = `
    <div class="ui cards" align = "center">
      <div class="card"   style="width:500px;height:700px;">
        <div class="content" align = "center">
        	<img src = "${listing.picture}" alt="PhotoOfTub" style="width:450px;height:450px;padding-bottom: 1em;	">
          <div class="header">${listing.name}</div>
          <div class="description">
            ${listing.description}
         </div>
          <div class="description">
          	$Price of the listing
          </div>
        </div>
        <div class="ui bottom attached button" id= "book-reservation">
          <i class="add icon"></i>
          Book This Tub!
        </div>
      </div>
    </div>
  </div>`
  temp.innerHTML = text
  document.getElementById('entire-page').appendChild(temp)
  // var btn = document.createElement('BUTTON')
  // btn.innerHTML = 'Click to Go Home'
  // btn.setAttribute("id", "home-button")
  // btn.setAttribute("class", "ui button")
  temp = document.createElement('div')
  temp.setAttribute('id', 'back-button-div')
  document.getElementById('entire-page').appendChild(temp)
  document.getElementById('back-button-div').appendChild(btn)
  document.getElementById('book-reservation').addEventListener('click',function(e){
    // console.log(e)
    let thisUserId = usersList.find(k=> k.username == loggedInUser).id
    let thisListingId = listing.id
    // console.log(usersList.find(k=> k.username == loggedInUser).id)
    // console.log(listing.id)
    let newReservation = new Reservation(thisUserId, thisListingId, Date.now())
    allReservations.push(newReservation)
    fetch("http://localhost:3000/api/v1/reservations",{
      method: 'POST',
      body: JSON.stringify({
        guest_id: thisUserId,
        listing_id: thisListingId,
        date_time: Date.now()
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
  })
}


function deleteEntirePage(){
  document.getElementById('entire-page').innerHTML = ''
}

function showHomePage(){

  //index-text
  let topText = document.createElement('div')
  topText.setAttribute("class", "ui text container")
  // topText.setAttribute("style", "text-align:center; margin-top: 3em;")
  topText.setAttribute("id", "index-text")
  topText.setAttribute("style", "text-align:center; margin-top: 3em;")
  document.getElementById('entire-page').appendChild(topText)

  //index-search
  let searchBar = document.createElement('div')
  searchBar.setAttribute("class", "ui container")
  searchBar.setAttribute("id", "index-search")
  var searchContainer = `<div class="ui category search" style="text-align: center; margin-top:3em;">
  <div class="ui icon input">
  <input class="prompt" type="text" placeholder="Search tubs..."><!-- search build out -->
  <i class="search icon"></i>
  </div>
  <div class="results"></div>
  </div>`
  searchBar.innerHTML = searchContainer
  document.getElementById('entire-page').appendChild(searchBar)

  //index-cards
  var textContainer = `<h1>BookATub</h1>
    <h2 style="color: gray;">For all your immediate relaxation needs...</h2>`
  //add list of cards container
  topText.innerHTML = textContainer
  let cards = document.createElement('div')
  cards.setAttribute("class", "ui container")
  cards.setAttribute("id", "index-cards")
  cards.setAttribute("style", "width: 65%; margin: 2em auto")
  var cardContainer = `<div class="ui link cards" id = 'list-o-cards'>
    </div>`
  cards.innerHTML = cardContainer
  document.getElementById('entire-page').appendChild(cards)

}

function showLogin(){

  var temp = document.createElement('div')
  temp.setAttribute("class", "ui container")
  temp.setAttribute("id", "listing-card")
  temp.setAttribute("style", "height: 50%; width: 80%;margin: 2em auto; padding-left: 2em;")
  //<div class="ui container" style="height: 50%; width: 80%;margin: 2em auto; padding-left: 2em;">
  let text = `
    <div class="ui cards">
      <div class="card">
        <div class="content">
        	<img src = "${listing.picture}" alt="PhotoOfTub" style="padding-bottom: 1em;	">
          <div class="header">${listing.name}</div>
          <div class="description">
            ${listing.description}
         </div>
          <div class="description">
          	$Price of the listing
          </div>
        </div>
        <div class="ui bottom attached button" id= "book-reservation">
          <i class="add icon"></i>
          Book This Tub!
        </div>
      </div>
    </div>
  </div>`
  temp.innerHTML = text
  document.getElementById('entire-page').appendChild(temp)
  var btn = document.createElement('BUTTON')
  btn.innerHTML = 'Click to Go Home'
  btn.setAttribute("id", "home-button")
  btn.setAttribute("class", "ui button")

  document.getElementById('entire-page').appendChild(btn)
  document.getElementById('book-reservation').addEventListener('click',function(e){
    // console.log(e)
    let thisUserId = usersList.find(k=> k.username == loggedInUser).id
    let thisListingId = listing.id
    // console.log(usersList.find(k=> k.username == loggedInUser).id)
    // console.log(listing.id)
    let newReservation = new Reservation(thisUserId, thisListingId, Date.now())
    allReservations.push(newReservation)
    fetch("http://localhost:3000/api/v1/reservations",{
      method: 'POST',
      body: JSON.stringify({
        guest_id: thisUserId,
        listing_id: thisListingId,
        date_time: Date.now()
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
  })


}
