// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});



// always shows the same hard-coded video.  You'll need to get the server to 
// compute the winner, by sending a 
// GET request to /getWinner,

async function getWinner(url = '/getWinner', videoElmts) {
  console.log("Sending get request: ");
  let response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }, //THIS NEEDS TO SEND IN JSON 
  });
  if (response.ok) {
    let data = await response.json();
    document.getElementById("nickname").textContent =(data.nickname);
    /////////

    return data;
    //return {videObj: data, divElement: videoElmts};
  } else {
    throw Error(response.status);
  }
}
// and send the result back in the HTTP response.
/*
getWinner('/getWinner', videoElmts)
  .then(function(result) {

    data = result;
  });
*/
showWinningVideo()
  

function showWinningVideo() {
  getWinner('/getWinner', divElmt)
  .then(function(result){
    console.log(result)
    let winningUrl = result.url;
  addVideo(winningUrl, divElmt);
  loadTheVideos();
  })
  
}
