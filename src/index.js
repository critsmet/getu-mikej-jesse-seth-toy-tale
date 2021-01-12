let addToy = false

const addBtn = document.querySelector("#new-toy-btn")
const toyCollection = document.getElementById('toy-collection')
const toyFormContainer = document.querySelector(".container")

addBtn.addEventListener("click", () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyFormContainer.style.display = "block"
  } else {
    toyFormContainer.style.display = "none"
  }
})

toyCollection.addEventListener('click', function(event){
  if(event.target.nodeName === "BUTTON"){
    //we need two things from this event
    //1. the ID of the toy
    //2. and the current value of likes so we can increase it
    let id = event.target.dataset.id
    let likesElement = document.getElementById(`${id}-likes`)
    let likes = likesElement.innerHTML.split(" ")[0]
    // likesElement.innerText = `${parseInt(likes) + 1} Likes`
    //optimistic rendering: changes are made to the screen whether or not a successful request has been made
    fetch(`http://localhost:3000/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        'Accept': "application/json"
      },
      body: JSON.stringify({
        "likes": parseInt(likes) + 1
      })
    })
    .then(function(){
      likesElement.innerText = `${parseInt(likes) + 1} Likes`
      console.log("Pessimistically made change to dom");
      //pessimistic rendering: waiting for the response before making the change
    })
  }
})

fetch("http://localhost:3000/toys")
  .then(jsonify)
  .then(putToysOnDom)

function putToysOnDom(jsonObj){
  jsonObj.forEach(function(toyObj){
    let toyDivHTML = toyDiv(toyObj)
    toyCollection.innerHTML += toyDivHTML
  })
}

function toyDiv({ name, image, likes, id}){
  //destructuring
  return `<div class="card">
    <h2>${name}</h2>
    <img src=${image} class="toy-avatar" />
    <p id="${id}-likes">${likes} Likes </p>
    <button data-id=${id} class="like-btn">Like <3</button>
  </div>`
}

function jsonify(resp){
  return resp.json()
}
