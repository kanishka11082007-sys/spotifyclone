console.log("hieeeee")
let currentsong = new Audio();
let currentTrack=""
let songs=[]
let allsongs=[]
// Select these BEFORE using them
let play = document.querySelector(".play");
let playimg = document.querySelector(".playimg");
function playMusic(songpath) {
    currentTrack=songpath
    currentsong.src = songpath;
    currentsong.play();

    playimg.src = "icons/pausesong.svg";

    const filename = songpath.split("/").pop();
    const cleanname = filename.replace(".mp3", "");

    document.querySelector(".songinfo").innerHTML = cleanname;
}
async function getsongs(folder="") {
    let path=folder ? `songs/${folder}/` : "songs/";

    let a = await fetch(`http://127.0.0.1:8080/${path}`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let i = 0; i < as.length; i++) {
        const href = as[i].getAttribute("href");

        if (href && href.toLowerCase().endsWith(".mp3")) {
            const filename = decodeURIComponent(href.split("/").pop());
            songs.push(`songs/${folder ? folder + "/" : ""}${filename}`
    );
}
    }

    return songs;
}
async function showplaylist(folder){
    //get songs from slelected playlist folder
    const playlistsong=await getsongs(folder);
    songs=playlistsong;
    const songlib=document.querySelector(".songlib");
    songlib.innerHTML="";
    for (const song of playlistsong){
        const filename = song.split("/").pop();
        const cleansong = filename.replace(".mp3", "");
        const parts = cleansong.split(" - ");
        const title=parts[0]
        const artist=parts[1]
        songlib.innerHTML += `
            <div class="songcard" data-song="${song}">
                <img class="music" src="icons/music.svg" alt="">

                <div class="song-info">
                    <h4>${title}</h4>
                    <p>${artist}</p>
                </div>

                <button class="songplay hover-white">
                    <img src="icons/playsong.svg" alt="">
                </button>
            </div>
        `;
    }
    document.querySelectorAll(".songcard").forEach(card => {
        card.addEventListener("click",()=>{
            playMusic(card.dataset.song);
        })
    })
}
document.querySelectorAll(".card[data-playlist]").forEach(card => {

    card.addEventListener("click", async (e) => {

        const playlist = card.dataset.playlist;

        // If playlist play button was clicked
        if (e.target.closest(".playbtn")) {

            // Load the playlist
            await showplaylist(playlist);

            // Play the first song
            if (songs.length > 0) {
                playMusic(songs[0]);
            }

            return;
        }

        // Otherwise, just show the playlist
        showplaylist(playlist);
    });

});

async function main(){
    //get the list of all  songs
    songs= await getsongs()
    allsongs=[...songs]
    const playlists=["jazz","love","pop","bollywood"]
    for (const playlist of playlists){
        const playlistsong=await getsongs(playlist)
        allsongs.push(...playlistsong)
    }
    console.log(songs) 
    
    //show all the songs in library
    let songlib=document.querySelector(".songlib")
    songlib.innerHTML=""; 

    for (const song of songs) {

    const filename = song.split("/").pop();
    const cleansong = filename.replace(".mp3", "");
    const parts = cleansong.split(" - ");


    const artist = parts[1];
    const title = parts[0];

    songlib.innerHTML += `
        <div class="songcard" data-song="${song}">
            <img class="music" src="icons/music.svg" alt="">

            <div class="song-info">
                <h4>${title}</h4>
                <p>${artist}</p>
            </div>

            <button class="play hover-white">
                <img class="playimg" src="icons/playsong.svg" alt="">
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

const search=document.querySelector(".search");
const searchresults = document.querySelector(".search-results");
search.addEventListener("input", ()=>{
    const query=search.value.toLowerCase();
    searchresults.innerHTML = "";
    if (query === "") {
        searchresults.style.display = "none";
        return;
    }
    searchresults.style.display = "block";
    const results =allsongs.filter(song=>{
        const filename=song.split("/").pop();
        const cleanname=filename.replace(".mp3","");
        return cleanname.toLowerCase().includes(query);
    })
    for (const song of results){
        const filename = song.split("/").pop();
        const cleanname = filename.replace(".mp3", "");
        const parts = cleanname.split(" - ");
        const title = parts[0];
        const artist = parts[1] || "";
        searchresults.innerHTML += `
        <div class="search-result" data-song="${song}">
            <div class="song-info">
                <h4>${title}</h4>
                <p>${artist}</p>
            </div>
        </div>`;
    }
    document.querySelectorAll(".search-result").forEach(result => {
    result.addEventListener("click", () => {
        playMusic(result.dataset.song);
    });
});

})

//to play and pause the image
play.addEventListener("click", () => {


    // If no song is loaded yet, play the first song
    if (currentsong.src === "") {
        playMusic(document.querySelector(".songcard").dataset.song);
        return;
    }

    if (currentsong.paused) {
        currentsong.play();
        playimg.src = "icons/pausesong.svg";
    } else {
        currentsong.pause();
        playimg.src = "icons/playsong.svg";
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
const hamburger=document.querySelector(".hamburger")
const sidebar=document.querySelector(".left")
const closebtn=document.querySelector(".closebtn")
const overlay=document.querySelector(".overlay")

hamburger.addEventListener("click",()=>{
    sidebar.classList.add("active");
    overlay.classList.add("active")
})
closebtn.addEventListener("click",()=>{
    sidebar.classList.remove("active")
    overlay.classList.remove("active")
})
overlay.addEventListener("click",()=>{
    sidebar.classList.remove("active")
    overlay.classList.remove("active")
})
//volume slider
const volseekbar = document.querySelector(".volseekbar");
const volseekcircle = document.querySelector(".volseekcircle");
currentsong.volume = 1;
volseekcircle.style.left = "100%";
volseekbar.addEventListener("click",(e)=>{
    const rect=volseekbar.getBoundingClientRect();
    let percent=((e.clientX-rect.left)/rect.width)*100
    
    //prevent values below 0 and above 100
    percent=Math.max(0,Math.min(100,percent))
    volseekcircle.style.left=percent +"%"
    currentsong.volume=percent/100
    console.log(percent);
    console.log(currentsong.volume);
    
})
const volumeimg=document.querySelector(".volumeimg")
let prevol=currentsong.volume
volumeimg.addEventListener("click",()=>{
    if(currentsong.muted==true){
        volumeimg.src="icons/volume.svg"
        prevol=currentsong.volume
        currentsong.muted=false
    }
    else if(currentsong.muted==false){
        volumeimg.src="icons/mute.svg"
        prevol=0;
        currentsong.muted=true
    }

})
