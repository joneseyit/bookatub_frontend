const baseUrl = "http://localhost:3000/api/v1/"
const listingsUrl = `${baseUrl}listings`
const reservationsUrl = `${baseUrl}reservations`
const usersUrl = `${baseUrl}users`

let currentListings = []

let listingList

document.addEventListener('DOMContentLoaded', () => {
  fetch(listingsUrl)
    .then(response => response.json())
    .then(json => renderHomepage(json))


  listingList = document.getElementById('list-o-cards')
  // listingList.addEventListener('click', function(e){
  //   //we need to render listing page with id of e.target.dataset.id
  //   console.log(e.target)
  //   // fetch(`${listingsUrl}/${e.target.dataset.id}`)
  //   //   .then(response => response.json())
  //   //   .then(json => console.log(json))
  //     // .then(json => renderListing(json))
  // })

});
function renderHomepage(json){
  createHTMLListings(json)
  //render any other elements that will be on the homepage
}

function handleListingClick(listingID){
  var temp = currentListings.find(x => x.id == listingID)
  console.log(temp)
  //render listing show page

}
// function createListings(arrayOfListings){
//
//   arrayOfListings.forEach(element => {
//     //create listing object
//     var temp = document.createElement('li')
//     temp.innerHTML = `Name: ${element.name} Photo: ${element.picture} Description: ${element.description}`
//     let newListing = new Listing(element.id, element.host_id, element.name, element.picture, element.description, element.location)
//     temp.setAttribute('data-id', newListing.id)
//     listingList.appendChild(temp)
//   })
//
// }


function createHTMLListings(arrayOfListings){

  arrayOfListings.forEach(element => {
    //create listing object
    let newListing = new Listing(element.id, element.host_id, element.name, element.picture, element.description, element.location)
    currentListings.push(newListing)
    var temp = document.createElement('a')
    temp.setAttribute("class", "ui card");
    let text = `<div class="content">
      <div class="header">${element.name}</div>
      <div class="meta">
        <span class="category">${element.location}</span>
      </div>
      <div class="description">
        <p>${element.description}</p>
      </div>
    </div>
    <div class="extra content">
      <div class="right floated author">
        <img class="ui avatar image" src="${element.picture}" alt="host-id-pic"> Host ID: ${element.host_id}
      </div>
    </div>`
    temp.innerHTML = text
    temp.setAttribute('data-id', newListing.id)
    temp.addEventListener('click', function(e){ handleListingClick(e.currentTarget.dataset.id)})
    listingList.appendChild(temp)
  })

}
