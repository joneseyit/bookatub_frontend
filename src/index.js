const baseUrl = "http://localhost:3000/api/v1/"
const listingsUrl = `${baseUrl}listings`
const reservationsUrl = `${baseUrl}reservations`
const usersUrl = `${baseUrl}users`

let currentListings

let listingList = document.getElementById('list-o-cards')

document.addEventListener('DOMContentLoaded', () => {
  fetch(listingsUrl)
    .then(response => response.json())
    .then(json => renderHomepage(json))

  // listingUl.addEventListener('click', function(e){
  //   //we need to render listing page with id of e.target.dataset.id
  //   console.log(e.target.dataset.id)
  //   fetch(`${listingsUrl}/${e.target.dataset.id}`)
  //     .then(response => response.json())
  //     .then(json => renderListing(json))
  // })

});

function renderListing(json){
  //render HTML to show single Listing info
  //remove UL elements
  listingUl.outerHTML = ""

  //add elements needed for Listing(show)
  var temp = document.createElement('h3')
  temp.innerHTML = `Listing Name: ${json.name} Picture: ${json.picture} Description: ${json.description}`
  document.body.appendChild(temp)
  //add new
  console.log(json, 'empty ul?')


}

function renderHomepage(json){
  createHTMLListings(json)
  //render any other elements that will be on the homepage
}

function createListings(arrayOfListings){

  arrayOfListings.forEach(element => {
    //create listing object
    var temp = document.createElement('li')
    temp.innerHTML = `Name: ${element.name} Photo: ${element.picture} Description: ${element.description}`
    let newListing = new Listing(element.id, element.host_id, element.name, element.picture, element.description, element.location)
    temp.setAttribute('data-id', newListing.id)
    listingUl.appendChild(temp)
  })

}


function createHTMLListings(arrayOfListings){

  //create an anchor tag


  arrayOfListings.forEach(element => {
    //create listing object
    console.log(element);
    var temp = document.createElement('a')
    temp.class = "ui card"
    let text = `<div class="content">
      <div class="header">Old-Fashioned Tub</div>
      <div class="meta">
        <span class="category">Tubs</span>
      </div>
      <div class="description">
        <p>A relaxing tub. Rub-a-dub.</p>
      </div>
    </div>
    <div class="extra content">
      <div class="right floated author">
        <img class="ui avatar image" src="/images/avatar/small/matt.jpg" alt="host-id-pic"> Matt
      </div>
    </div>`
    temp.innerHTML = text
    let newListing = new Listing(element.id, element.host_id, element.name, element.picture, element.description, element.location)
    temp.setAttribute('data-id', newListing.id)
    listingUl.appendChild(temp)
  })
//   `
//   <div class="content">
//     <div class="header">Old-Fashioned Tub</div>
//     <div class="meta">
//       <span class="category">Tubs</span>
//     </div>
//     <div class="description">
//       <p>A relaxing tub. Rub-a-dub.</p>
//     </div>
//   </div>
//   <div class="extra content">
//     <div class="right floated author">
//       <img class="ui avatar image" src="/images/avatar/small/matt.jpg" alt="host-id-pic"> Matt
//     </div>
//   </div>
// `
}
