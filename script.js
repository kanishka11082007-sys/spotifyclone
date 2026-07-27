console.log("hieeeee")
let currentsong = new Audio();
let currentTrack=""
let songs=[]
// Select these BEFORE using them
let play = document.querySelector(".play");
let playimg = document.querySelector(".playimg");
function playMusic(songname) {
    currentTrack=songname
    currentsong.src = `songs/${songname}`;
    currentsong.play();

    playimg.src = "pausesong.svg";

    document.querySelector(".songinfo").innerHTML =
        songname.replace(".mp3", "");
}
async function getsongs() {
    let a = await fetch("http://127.0.0.1:8080//songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let i = 0; i < as.length; i++) {
        const href = as[i].getAttribute("href");

        if (href && href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(href.replace("./", "")));
        }
    }

    return songs;
}

async function main(){
    //get the list of all  songs
     songs= await getsongs()
    console.log(songs) 
    
    //show all the songs in library
    let songlib=document.querySelector(".songlib")
    songlib.innerHTML=""; 

    for (const song of songs) {

    const cleanSong = song.replace(".mp3", "");
    const parts = cleanSong.split(" - ");

    const artist = parts[1];
    const title = parts[0];

    songlib.innerHTML += `
        <div class="songcard" data-song="${song}">
            <img class="music" src="music.svg" alt="">

            <div class="song-info">
                <h4>${title}</h4>
                <p>${artist}</p>
            </div>

            <button class="play hover-white">
                <img class="playimg" src="playsong.svg" alt="">
            </button>
        </div>`;
    }
    //to play whichever song we click
    document.querySelectorAll(".songcard").forEach(card => {
    card.addEventListener("click", () => {
        playMusic(card.dataset.song);
    });
});

}
main()
//to play and pause the image
play.addEventListener("click", () => {


    // If no song is loaded yet, play the first song
    if (currentsong.src === "") {
        playMusic(document.querySelector(".songcard").dataset.song);
        return;
    }

    if (currentsong.paused) {
        currentsong.play();
        playimg.src = "pausesong.svg";
    } else {
        currentsong.pause();
        playimg.src = "playsong.svg";
    }

});
//to show time duration
function formattime(second){
    let mins=Math.floor(second/60)
    let secs=Math.floor(second%60)
    
    if(mins<10)mins="0"+mins
    if(secs<10)secs="0"+secs
    return `${mins}:${secs}`
}
currentsong.addEventListener("timeupdate",()=>{
    document.querySelector(".songtime").innerHTML=
     `${formattime(currentsong.currentTime)}/${formattime(currentsong.duration)}`
})
currentsong.addEventListener("ended", () => {
    nextsong()

});
formattime(currentsong.currentTime)
//circle of seekbar move
currentsong.addEventListener("timeupdate",()=>{
    let percent=(currentsong.currentTime/currentsong.duration)*100;
    document.querySelector(".circle").style.left=percent+"%";
})
//to shift seekbar btn
let seekbar = document.querySelector(".seekbar");
seekbar.addEventListener("click",(e)=>{
         let percent = (e.offsetX / seekbar.getBoundingClientRect().width) * 100;
         console.log("working!!")
         document.querySelector(".circle").style.left = percent + "%";

         currentsong.currentTime = (currentsong.duration * percent) / 100;
    })
//next btn feature
let nxtbtn=document.querySelector(".nextsong")
nxtbtn.addEventListener("click",()=>{
    nextsong()
})
//prev btn feature
let prevbtn=document.querySelector(".prevsong")
prevbtn.addEventListener("click",()=>{
    let index=songs.indexOf(currentTrack)
    if(index==0){
        index=songs.length-1
        playMusic(songs[index])
    }
    else{
        playMusic(songs[index-1])
    }
})
//next song function
function nextsong(){
    if(currentTrack===""){
        return;
    }
    let index=songs.indexOf(currentTrack)
    if(index==songs.length-1){
        index=0
        playMusic(songs[index])
    }
    else{
        playMusic(songs[index+1])
    }

}