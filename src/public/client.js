
let store = Immutable.Map({
    user: Immutable.Map({ name: 'Student' }),
    apod: '',
   rovers: Immutable.List([]),
    selectedRover: false,
    
})
// add our markup to the page
const root = document.getElementById('root')


const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    const response = await fetch(`http://localhost:3000/rovers`)

    let roversArray= await response.json()
let roverName = roversArray.rovers.map(i=> {return i.name}) //hof
    root.innerHTML = App(state,roverName)
}

// create content
//app is HOF it return another function
const App =  (state,roverName) => {
    let { rovers, apod } = state
    

    const newState = store.set('rovers', roverName);
    
    // updates the old state 
    updateStore(store, newState)


return listOfRovers(state)

   
   

}// app

const listOfRovers =  (state) =>{

    if (state.get('selectedRover')==false)  {
        return (`
        
        <header>Mars Dashboard</header>
        <main>
            ${Array.from(state.get('rovers')).map(x=>{
             return `<br><button name="${x}" class="button" onclick="handleClick(event)">${x}</button>`
            })
           
        }
            </section>
        </main>
        <footer></footer>
        `)
    } else {
        // check if "currentRover" has a value and render images
        return (`
        <header>Mars Dashboard</header>
        <main>
            ${Array.from(state.get('rovers')).map(x=>{
             return `<br><button name="${x}" class="button" onclick="handleClick(event)">${x}</button>`
            })
           
        }
<div>${DisplayImages(state)}</div>
            </section>
        </main>
        <footer></footer>
      
        `)
    }
   
}



// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

//handle click button to get the rover name that clicked by user
const handleClick = event => {

   // set name of the button clicked to a  variable
    let roverName= event.target.name
    //check for the rovername in store
    if (Array.from(store.get('rovers')).includes(roverName)) {
        // get Rover images and data from the API
       getRoverData(roverName, store);
    }
    else {
        console.log(`ups!!! is not included`) 
    } 
} 


// ------------------------------------------------------  API CALLS
// Request to server
const getRoverData = async (roverName, state) => {
   let { currentRover } = state
   // get data from the API
   const response = await fetch(`http://localhost:3000/rovers/${roverName}`) // get data or Response from the promise returned by fetch()
   currentRover = await response.json() // get data from the promise returned by .json()
  
   const newState = store.set('selectedRover', currentRover);
    
   // updates the old state 
   updateStore(store, newState)
  // DisplayImages(state)
   return currentRover
  
}

const DisplayImages= (state)=>{

    console.log('dis')
    // return `<h1- class="id">${state.get('currentRover')['photos'][0].id}</h1>`
  console.log(state.get('selectedRover'))
return state.get('selectedRover')['latest_photos'].map(x=>{
return(    `
    <div class="responsive">
    <div class="gallery">
    <a target="_blank">
    <img src="${x.img_src}" alt="${x.id}" height="400">
  </a>
      <div class="desc">Landing Date: ${x.rover.landing_date} <br> name: ${x.rover.name}<br> launch_date: ${x.rover.launch_date} <br> status: ${x.rover.status}</div>

    </div>
    </div>
  
    `)
}

).slice(0, 50).join("")
}