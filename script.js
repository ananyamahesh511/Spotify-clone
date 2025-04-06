console.log('Let us write java script')
let currentSong = new Audio(); 
let songs;
function formatTime(seconds) {
    if(isNaN(seconds) || seconds<0){
        return "00:00" 
    }
    const minutes = Math.floor(seconds/60)
    const remainingSeconds = Math.floor(seconds%60)
    const formattedMinutes = String(minutes).padStart(2,'0')
    const formattedSeconds = String(remainingSeconds).padStart(2,'0')
    return `${formattedMinutes}:${formattedSeconds}`
}
//Now we are using a fetch API to fetch contents from a given url, in this case we are fetching songs from the songs url
//SAMPLE CODE USING AWAIT FETCH
// async function fetchData(){
    // let response = await fetch("url");
    // let data = await response.json();
    // console.log(data);
    // }
    // fetchData();
 async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;//storing the html response in the new created div
    let as = div.getElementsByTagName("a");// getting elements with the tag 'a' in div
    console.log(as);//printing the html collection of all 'a' tags
    let songs = []//creating an empty songs array
    for (let index = 0; index < as.length; index++) {//traversing through html collection of as
        const element = as[index];//each as[index] is assigned to variable 'element'
        if(element.href.endsWith(".mp3")){//if the element's href ends with .mp3
            let songName = decodeURIComponent(element.href.split("/").pop().replace(".mp3", ""));//splitting the url into an array using | as the  separator
                       //.pop() gets the last part of the URL (the actual file name, like songname.mp3).
                       //.replace(".mp3", "") removes the .mp3 file extension
            songName = songName.replace(/.*?[：｜-]\s*/, '');
            //The above line uses a regular expression (replace) to remove everything before the first occurrence of either a colon (：), vertical bar (｜), or hyphen (-) followed by a space
            songName = songName.replace(/\(.*?\)/g, '').trim();
            // The above line Removes anything inside parentheses (extra metadata)
            songs.push(songName);
        } 
        
    }
    return songs//return all the songs
 }
 const playMusic = (track, pause=false)=>{
    let encodedTrack = encodeURIComponent(track.trim()); // Encode song name properly
    if(!pause){
        currentSong.play()
        play.src = "images/pause.svg"
    }
    let audio = new Audio(` http://127.0.0.1:5500/songs/${encodedTrack}.mp3`);

    console.log("Playing:", audio.src); // Debugging
    currentSong.src = `http://127.0.0.1:5500/songs/${encodedTrack}.mp3`
    currentSong.play()
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
 }
 //getSongs is an async fuction so it does not return the final results immedeately  instead it returns a promise.We have to wait till the promise is fulfilled and then  we can get the result of the function.To await the promise of getSongs to be  fulfilled, we use an async main function
async function main(){
    songs =  await getSongs();//waits till the promise of getSongs is fulfilled and then stores the result in songs variable
    playMusic(songs[0], true)
    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0];//songUL is a variable containing all the songs in the song list
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><i class="fa-solid fa-music" style="color: #dedede;"></i> 
            <div class="info">
              <div class="song-name">${song}</div>
            </div>
            <div class="play-now">
              <span>Play Now</span>
              <i class="fa-solid fa-play" style="color: #e8e8e8;"></i>
            </div>
            </li>`; 
    }
    //Attach an event listener to each song
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",()=>{
            let songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
            console.log("Clicked song:", songName); // Debugging
            playMusic(songName);
        })
    })
 //Attach an event listener to play, previous and nex
  play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src = "images/pause.svg" 
    }
    else{
        currentSong.pause()
        play.src="images/play.svg"
    }
  })
  // Listen for time-update event
  currentSong.addEventListener("timeupdate",()=>{
    console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%"
  })
  //add an eventlistener to seekbar
  document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent =  (e.offsetX/e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left = percent + "%"
    currentSong.currentTime = ((currentSong.duration) * percent)/100
  })
  //Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-6px"
  })

  previous.addEventListener("click", () => {
    console.log("previous clicked");
    let currentSongName = decodeURIComponent(currentSong.src.split("/").pop().replace(".mp3", "").trim());
    let index = songs.indexOf(currentSongName);
    
    if (index > 0) {
        playMusic(songs[index - 1]); // Play the previous song
    }
});

next.addEventListener("click", () => {
  currentSong.pause()
    console.log("next clicked");
    let currentSongName = decodeURIComponent(currentSong.src.split("/").pop().replace(".mp3", "").trim());
    let index = songs.indexOf(currentSongName);
    
    if (index + 1 < songs.length) { // Correct condition to prevent overflow
        playMusic(songs[index + 1]); // Play the next song
    }
});
//Add an event listener to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
  console.log(e, e.target, e.target.value);
  currentSong.volume = parseInt(e.target.value)/100
})
}
main();//calling async main function
