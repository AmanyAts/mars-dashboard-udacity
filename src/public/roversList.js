export async function renderMenue(){

     const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=iuuIhC2TN5wfRvmCAobKhbdyOqj49O1A8F9zmsYh`)

   return await response.json()
}