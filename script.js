
let PUBLICKEY = "9ab871748d83ae2eb5527ffd69e034de";
let hash = "d35377547e551cd64a60657d2517bb7f";
const APIURL = "https://gateway.marvel.com/v1/public/";
const APIKEY = `&apikey=${PUBLICKEY}&hash=${hash}?ts=1`

const searchContainer = document.querySelector('.searchContainer')
const searchInput = document.getElementById('search-input')
const cardContainer = document.querySelector('.cardBox')


const characterTitle = document.getElementById('character-title')
const characterImage = document.getElementById('character-image')
const characterDescription = document.getElementById('character-description')



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
                      <p>
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

  const movieInfoContainer = document.querySelector('#movie-card-container')

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
        })

    }
    
  } catch (error) {
    console.log(error)
  }
}

async function renderCharacterMoreInfo(element,data){

    element.innerHTML=`
         <div class="title-content">
              <h2>Card Details</h2>
              <span class="icon1"><i class="fa-solid fa-right-from-bracket"></i></span>
              <span class="icon2"><i class="fa-solid fa-circle-xmark"></i></span>
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
                  <a href=""><h3>Click Me</h3></a>
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
                  <h3>Suggestion Card <span><i class="fa-solid fa-circle-info"></i></span></h3>
                <div class="comic-info box-color-hover">
                  <div class="comic">
                    <h2>Comic title</h2>
                    <p> ${data.comics.available}</p>
                  </div>
      
                  <div class="comic box-color-hover">
                    <h2>Series title</h2>
                    <p>${data.series.available}</p>
                  </div>
      
                  <div class="comic box-color-hover">
                    <h2>Stories title</h2>
                    <p>${data.stories.available}</p>
                  </div>
                  <div class="comic box-color-hover">
                    <h2>Events title</h2>
                    <p>${data.events.available}</p>
                  </div>
                </div>
              </div>
      
            </div>
            </div>
    `;

}

userInput()

