let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
let heartIcons = document.querySelectorAll("far");
let nextButtons = document.getElementById("nextButton");
let icon = document.querySelectorAll("i.far")
let heartButtons2 = document.querySelectorAll("div.heart2");


for (let i = 0; i < 2; i++) {
  let reload = reloadButtons[i];
  reload.addEventListener("click", function() { reloadVideo(videoElmts[i]) });





  /*
  function pref() {
    reloader();
    console.log("whats good");
    //insertPref();
  
  
  };*/
let heart2 = heartButtons2[i];

  heartButtons2[i].classList.add("hidden");
  heartButtons[i].classList.add("unloved");
  let heart = heartButtons[i];
  heart.addEventListener("click", function() {
    heart.classList.toggle("hidden");
    heart.classList.toggle("unloved");
    heart2.classList.toggle("hidden");


    if (!heartButtons[Math.abs(i - 1)].classList.contains("unloved")) {
      heartButtons[Math.abs(i - 1)].classList.toggle("unloved");
      heartButtons[Math.abs(i - 1)].classList.toggle("hidden");
      //heartButtons[i].classList.toggle("hidden");
      heartButtons2[Math.abs(i - 1)].classList.toggle("hidden");
      
      //heartButtons[Math.abs(i-1)].classList.add("fas fa-heart");
      //document.getElementById("heart").classList.add('fas fa-heart')


    }



  });
} // for loop

// hard-code videos for now
// You will need to get pairs of videos from the server to play the game.



//gets two random video//////////////////////////////////
async function getTwoVideos(url = '/getTwoVideos', videoElmts) {
  // console.log("Sending get request: ");
  let response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }, //THIS NEEDS TO SEND IN JSON 
  });
  if (response.ok) {
    let data = await response.json();
    darr = document.getElementsByClassName("nickname");
    for (let i = 0; i < 2; i++) {
      darr[i].textContent = (data[i].nickname);
    }
    console.log(data)

    /////////

    return data;
    //return {videObj: data, divElement: videoElmts};
  } else {
    throw Error(response.status);
  }
}

getTwoVideos('/getTwoVideos', videoElmts)
  .then(function(result) {

    data = result;

    nextButtons.addEventListener("click", function() {
      let prefArr = [];
      if (heartButtons[0].classList.contains("unloved") && (!heartButtons[1].classList.contains("unloved"))) {
        prefArr[0] = data[1].rowIdNum;
        prefArr[1] = data[0].rowIdNum;
      }
      else if (heartButtons[1].classList.contains("unloved") && (!heartButtons[0].classList.contains("unloved"))) {
        prefArr[0] = data[0].rowIdNum;
        prefArr[1] = data[1].rowIdNum;
      }
      else {
        alert("YOU MUST LIKE A VIDEO. COOPERATE OR I WILL DESTROY YOU.");

      }
      if (prefArr.length != 0) {
        insertPref("/insertPref", prefArr)
          .then(function(rslt) {
            if (rslt == "continue") {
              //sessionStorage.setItem("prefArr: ", JSON.stringify(rID))
              console.log(rslt);
              window.location.reload(true);
            }
            else {
              document.location.href = "/winner.html";
            }
          })
      }


    });
    console.log("Test1", data);
    console.log("Test2", data[1]);

    for (let i = 0; i < 2; i++) {

      addVideo(data[i].url, videoElmts[i]);
    }
    // load the videos after the names are pasted in! 
    loadTheVideos();
  })
  .catch(function(error) {
    console.log("EERRRRORORRORRRRRRRR");
  })

for (let i = 0; i < 2; i++) {
  addVideo(data[i], videoElmts[i]);
}



async function insertPref(url = '/insertPref', data) {
  //console.log("Sending the following delete url: ", data);
  let response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, //THIS NEEDS TO SEND IN JSON 
    body: JSON.stringify(data)
  });
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

let pArr = [1, 2, 3, 4];
//sendPostRequest("/insertPref", pArr) 


//const nbutton = document.getElementById("nextButton");


// console.log(i);

// insertPref('/insertPref', videoElmts)
//     .then(function() {
//       console.log("test")

//     })
//     .catch(function(error) {
//       console.log("Error occurred:", error)
// })a




const urls = ["https://www.tiktok.com/@berdievgabinii/video/7040757252332047662",
  "https://www.tiktok.com/@catcatbiubiubiu/video/6990180291545468166"];
/*
for (let i=0; i<2; i++) {
      addVideo(urls[i],videoElmts[i]);
    }
    // load the videos after the names are pasted in!
    loadTheVideos();*/



