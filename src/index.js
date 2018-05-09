const baseUrl = "http://localhost:3000/api/v1/"
const listingsUrl = `${baseUrl}listings`
const reservationsUrl = `${baseUrl}reservations`
const usersUrl = `${baseUrl}users`

let currentlyLoggedIn = false
let currentListings = []
let usersList = []
let loggedInUser = 'Frank the Tank'
let listingList

document.addEventListener('DOMContentLoaded', () => {
  fetch(listingsUrl)
    .then(response => response.json())
    .then(json => renderHomepage(json))
  fetch(usersUrl)
    .then(response => response.json())
    .then(json => createUsers(json))

  listingList = document.getElementById('list-o-cards')
  logInButton = document.getElementById('login-btn')
  userButton = document.getElementById('user-btn')
  logInButton.addEventListener('click', () => {
    handleLogInClick();
  })
  userButton.addEventListener('click', () => {
    // handleLogInClick();
    console.log(currentlyLoggedIn, loggedInUser)
    debugger
  })

});//end of DOMContentLoaded

function createUsers(json){
  json.forEach(element => {
    // debugger;
    let newUser = new User(element.id, element.username, element.password, element.age, element.location)
    usersList.push(newUser)
  })
}

function renderHomepage(json){
  createListingsFromJson(json)
  createHTMLListings()
}

function createListingsFromJson(json){
  json.forEach(element => {
    //create listing object
    let newListing = new Listing(element.id, element.host_id, element.name, element.picture, element.description, element.location)
    currentListings.push(newListing)
  })
}

function createListingElementAndAppend(singleListing){
  var temp = document.createElement('a')
  temp.setAttribute("class", "ui card");
  let text = `<div class="content">
    <div class="header">${singleListing.name}</div>
    <div class="meta">
      <span class="category">${singleListing.location}</span>
    </div>
    <div class="description">
      <p>${singleListing.description}</p>
    </div>
  </div>
  <div class="extra content">
    <div class="right floated author">
      <img class="ui avatar image" src="${singleListing.picture}" alt="host-id-pic"> Host ID: ${singleListing.host_id}
    </div>
  </div>`
  temp.innerHTML = text
  temp.setAttribute('data-id', singleListing.id)
  temp.addEventListener('click', function(e){ handleListingClick(e.currentTarget.dataset.id)})
  document.getElementById('list-o-cards').appendChild(temp)
}

function createHTMLListings(){
  currentListings.forEach(element => {
    createListingElementAndAppend(element)
  })
}

function handleLogInClick(){
  //check to see what page we are coming from, handle accordingly
  removeElementsForListingShow()
  renderSignIn()
}

function removeElementsForListingShow(){

  let indexText = document.getElementById('index-text')
  let indexCards = document.getElementById('index-cards')
  let indexSearch = document.getElementById('index-search')
  indexText.outerHTML = ""
  indexCards.outerHTML = ""
  indexSearch.outerHTML = ""
}

function renderSignIn(){
  var text = `<form class="ui form">
    <div class="field">
      <label>Username</label>
      <input type="text" name="first-name" placeholder="First Name">
    </div>
    <button class="ui button" type="submit" id= "login-submit">Submit</button>
  </form>`
  let signEl = document.createElement('div')
  signEl.setAttribute("class", "ui text container")
  signEl.setAttribute("id", "login-form")
  signEl.setAttribute("style", "width:30%;margin: 2em auto;")
  signEl.innerHTML = text
  document.body.appendChild(signEl)
  let backButton = document.createElement('BUTTON')
  backButton.innerHTML = "Cancel"
  backButton.setAttribute("id", "back-btn")
  backButton.addEventListener('click', function(){
    handleBackFromSignIn();
  })
  document.body.appendChild(backButton)
  document.getElementById("login-submit").addEventListener('click', function(e) {
    e.preventDefault();
    currentlyLoggedIn = !currentlyLoggedIn
    console.log(currentlyLoggedIn)
    handleBackFromSignIn()
  })
}

function handleBackFromSignIn(){
  document.getElementById('login-form').outerHTML = ""
  document.getElementById('back-btn').outerHTML = ""
  reRenderHome();
  createHTMLListings()
}

function handleListingClick(listingID){
  var temp = currentListings.find(x => x.id == listingID)
  removeElementsForListingShow()
  loadListingShowPage(temp)
  var btn = document.getElementById('home-button')
  btn.addEventListener('click', function (){
    removeListingLoadHome();
  })
}

function removeListingLoadHome(){
  document.getElementById('listing-card').outerHTML = ""
  //button
  document.getElementById('home-button').outerHTML = ""
  reRenderHome();
  createHTMLListings();
}

function loadListingShowPage(listing){
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
        <div class="ui bottom attached button">
          <i class="add icon"></i>
          Book This Tub!
        </div>
      </div>
    </div>
  </div>`
  temp.innerHTML = text
  document.body.appendChild(temp)
  var btn = document.createElement('BUTTON')
  btn.innerHTML = 'Click to Go Home'
  btn.setAttribute("id", "home-button")
  btn.setAttribute("class", "ui button")
  // btn.setAttribute("margin", "50%")

  document.body.appendChild(btn)
}

function reRenderHome(){
  //text Container
  let topText = document.createElement('div')
  topText.setAttribute("class", "ui text container")
  // topText.setAttribute("style", "text-align:center; margin-top: 3em;")
  topText.setAttribute("id", "index-text")
  topText.setAttribute("style", "text-align:center; margin-top: 3em;")
  document.body.appendChild(topText)
  // //add search bar

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
  document.body.appendChild(searchBar)
  //add text container
  var textContainer = `<h1>BookATub</h1>
    <h2 style="color: gray;">For all your immediate relaxation needs...</h2>`
  //add list of cards container
  topText.innerHTML = textContainer

  // debugger;
  let cards = document.createElement('div')
  cards.setAttribute("class", "ui container")
  cards.setAttribute("id", "index-cards")
  cards.setAttribute("style", "width: 65%; margin: 2em auto")
  var cardContainer = `<div class="ui link cards" id = 'list-o-cards'>
    </div>`
  cards.innerHTML = cardContainer
  document.body.appendChild(cards)
}
