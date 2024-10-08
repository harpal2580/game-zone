
let PUBLICKEY = "9ab871748d83ae2eb5527ffd69e034de";
let hash = "d35377547e551cd64a60657d2517bb7f";
const APIURL = "https://gateway.marvel.com/v1/public/";
const APIKEY = `&apikey=${PUBLICKEY}&hash=${hash}?ts=1`

const searchContainer = document.querySelector('.searchContainer')
const searchInput = document.getElementById('search-input')
const cardContainer = document.querySelector('.cardBox')
const movieInfoContainer = document.querySelector('#movie-card-container')


const characterTitle = document.getElementById('character-title')
const characterImage = document.getElementById('character-image')
const characterDescription = document.getElementById('character-description')

const favoritelistCardContainer = document.querySelector('.favourite-card-container') 
let favoriteListLocalStorage = JSON.parse(localStorage.getItem('favouriteListLocalStorage'))
console.log(favoriteListLocalStorage)

/*Show section on the menu */
function showContent(section) {
  console.log(section);

  // Hide all content
  const contents = document.querySelectorAll('.content_hide');
  contents.forEach(content => content.classList.remove('active'));

  // Show the selected content
  document.getElementById(section).classList.add('active');
}


function userInput() {
  searchInput.addEventListener('input', () => {
    fetchCharacters();
  })
}


async function fetchCharacters() {
  try {    
    const response = await fetch(APIURL + `characters?nameStartsWith=${searchInput.value.trim()}` + APIKEY)
    const data = await response.json();
    console.log(data)
    if (data.status == 'Ok') {
      renderCharacters(data.data.results)
    } else {
      cardContainer.innerHTML = 'No Record Found'
    }

  } catch (error) {
    console.log(error)

  }

}


function renderCharacters(characters) {
  console.log(characters)  
  cardContainer.innerHTML = '';
  if (characters.length > 0) {
    for (const character of characters) {
      character.id = (character.id != '') ? character.id : 'Not Available'
      character.name = (character.name != '') ? character.name : 'Not Available'
      character.description = (character.description != '') ? character.description : 'Not Available'
      character.comics.available = (character.comics.available > 0) ? character.comics.available : '0'
      character.series.available = (character.series.available > 0) ? character.series.available : '0'
      character.stories.available = (character.stories.available > 0) ? character.stories.available : '0'

      const element = document.createElement('div')
      element.classList.add('flip-card')

      renderCard(element, character)
      cardContainer.appendChild(element)

    }

  } else {
    cardContainer.innerHTML = 'No Record Found'
  }

}

function renderCard(element, data) {

  element.innerHTML = `
                 
                  <div class="flip-card-inner"  id="movie-info-card-${data.id}">
                    <div class="flip-card-front">
                      <img
                         src="${data.thumbnail.path + '/standard_fantastic.' + data.thumbnail.extension}"
                        alt=""
                      />
                      <p class="title">${data.name}</p>
                    </div>
                    <div class="flip-card-back" id="movie-info-${data.id}">
                      <p class="title">${data.name}</p>
                      <p class="center">
                      ${data.description}
                      </p>
                    </div>
                  </div>
                
                   `
        if(data.id !='null'){
          setTimeout(()=>{
              const movieInfoContainer = document.getElementById(`movie-info-${data.id}`)
              movieInfoContainer?.addEventListener('click',()=>moreInfo(data.id))
          },1000)
        }
}


async function moreInfo(id) {



  searchContainer.style.display='none'
  movieInfoContainer.style.display='block';

  try {

    const request  = await fetch(APIURL + `/characters/${id}?apikey=${PUBLICKEY}`);
    const data = await request.json();
    if (data.status == 'Ok') {

        data.data.results.forEach(response=>{
            
            response.id = (response.id !='') ? response.id : 'Not Available';
            response.name = (response.name !='') ? response.name : 'Not Available';
            response.description = (response.description !='') ? response.description : 'Not Available';
            response.comics.available = (response.comics.available>0) ? response.comics.available : '0';
            response.series.available = (response.series.available>0) ? response.series.available : '0';
            response.stories.available = (response.stories.available>0) ? response.stories.available : '0';
            response.events.available = (response.events.available>0) ? response.events.available : '0';

            const element = document.createElement('div')
            element.classList.add('character-more-info')

            renderCharacterMoreInfo(element,response)
            movieInfoContainer.appendChild(element)
 
              const checkItemLocalStorage = favoriteListLocalStorage.find(item=> parseInt(item) === response.id)
              if(checkItemLocalStorage){
                  document.querySelector('.add-to-favorites-button').innerHTML = 'Remove From Favorites'
              }else{
                  document.querySelector('.add-to-favorites-button').innerHTML = 'Add To Favorites'
              }
          })

    }else{

      movieInfoContainer.innerHTML=`<div class="no-record-found">
        <img src="https://cdn-icons-png.flaticon.com/256/7465/7465691.png">
      </div>`
    }
    
  } catch (error) {
    console.log(error)
  }
}

async function renderCharacterMoreInfo(element,data){

    element.innerHTML=`
         <div class="title-content">
              <h2>Character Details</h2>
              <span class="icon1" id="close-more-info"><i class="fa-solid fa-right-from-bracket"></i></span>
            </div>
            <div class="layer-content">
              <div class="left-layer">
                <div class="img-div">
                  <img
                    src="${data.thumbnail.path + '/standard_fantastic.' + data.thumbnail.extension}"
                    alt=""
                  />
                </div>
                <div class="submit-button">
                  <div id="add-to-favorite-${data.id}">
                    <span class="add-to-favorites-button" id="favoriteslist-button-${data.id}">Add To Favorite</span>
                  </div>
                </div>
              </div>
      
              <div class="right-layer">
                <div class="card-title">
                  <h2>${data.name}</h2>
                  <p class="info">
                      ${data.description}
                  </p>
                </div>
                
                <!-- ----- suggestion div------ -->
                 <div class="sugest-div">
                  <h3>Count <span><i class="fa-solid fa-circle-info"></i></span></h3>
                <div class="comic-info box-color-hover">
                  <div class="comic box-color-hover">
                    <h2> Comics</h2>
                    <p> ${data.comics.available}</p>
                  </div>
      
                  <div class="comic box-color-hover">
                    <h2> Series</h2>
                    <p>${data.series.available}</p>
                  </div>
      
                  <div class="comic box-color-hover">
                    <h2> Stories</h2>
                    <p>${data.stories.available}</p>
                  </div>
                  <div class="comic box-color-hover">
                    <h2> Events</h2>
                    <p>${data.events.available}</p>
                  </div>
                </div>
                <div class="bookmark">
                <span class="bm-icon">🔖<span>
                </div>
              </div>
      
            </div>
            </div>
    `;

    setTimeout(() => {
      const closeMoreInfo = document.getElementById('close-more-info');
      closeMoreInfo?.addEventListener('click', function () {
          closeMore();
      })

      const addToFavoriteBtn = document.getElementById(`add-to-favorite-${data.id}`)
      addToFavoriteBtn?.addEventListener('click',function(){
        addToFavoriteList(`${data.id}`)
      })
    }, 1000);
}


if(favoriteListLocalStorage == null){
  favoriteListLocalStorage=[];
}

function addToFavoriteList(id){

  const infoFavoriteListButton = document.getElementById(`favoriteslist-button-${id}`) 
  infoFavoriteListButton.innerHTML = (favoriteListLocalStorage.includes(id)) ? `Add To Favorite list` : 'Remove From Favorite List';

  let index = favoriteListLocalStorage.indexOf(id)

  if(index !== -1){  // it means id included in the code
    favoriteListLocalStorage.splice(index,1)
    localStorage.setItem('favouriteListLocalStorage',JSON.stringify(favoriteListLocalStorage))
    showFavouriteList();
    return;
  }

  favoriteListLocalStorage.push(id);
  localStorage.setItem('favouriteListLocalStorage',JSON.stringify(favoriteListLocalStorage))
  showFavouriteList();
}


function showFavouriteList(){

  favoritelistCardContainer.innerHTML=``;
  if(favoriteListLocalStorage.length==""){
    favoritelistCardContainer.innerHTML=` No Character in the favorite list`;
  }else{
    favoriteListLocalStorage.forEach(id=>{
      addCharacterToDOM(id)
    })
  }

}

async function fetchDataAndUpdateDom(id){
    const response = await fetch(`${APIURL}/characters/${id}?apikey=${PUBLICKEY}`)
    const data = await response.json();
    return data
}

async function addCharacterToDOM(id){
  const response = await fetchDataAndUpdateDom(id)
  response.data.results.forEach(data=>{
    const element = document.createElement('div')
    element.innerHTML=`
               <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                             <img src="${data.thumbnail.path + '/standard_fantastic.' + data.thumbnail.extension}" alt="">
                            <p  class="title">${data.name}</p>
                             
                        </div>
                        <div class="flip-card-back">
                            <p class="title">BACK</p>
                            <p class="center">${data.description}</p>
                         <p class="fvrt-rermove-icon">
                          <h2>Remove</h2>
                          </p>
                        </div>
                    </div>
                </div>
    `;

    favoritelistCardContainer.appendChild(element)
  })
}

addEventListener("DOMContentLoaded", (event) => {
  showFavouriteList();
});



function closeMore(){
  movieInfoContainer.style.display='none';
  searchContainer.style.display='block';
  movieInfoContainer.innerHTML='';
}


userInput()

