import fs from "fs"
import { parseFile } from "music-metadata"
import { inspect } from 'util';

const PATH = "./foo_now_playing.json";

const OUTPUT_PATH = "./cover.png";
var lastPLaying = {
        playing: 0,
        paused: 0,
        albumartist: "",
        album: "",
        artist: "",
        title: "",
        tracknumber: 0,
        length: 0,
        elapsed: 0,
        path: ""
    }
var nowPlaying = {
        playing: 0,
        paused: 0,
        albumartist: "",
        album: "",
        artist: "",
        title: "",
        tracknumber: 0,
        length: 0,
        elapsed: 0,
        path: ""
    }
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateNowPlaying(){
    fs.readFile(PATH, 'utf8', async (err, data) => {
        if (err) {
            console.error(err)
            return
        }
    
        nowPlaying = JSON.parse(data.replace(/^\uFEFF/, '')).nowplaying
        console.log(nowPlaying)
    })
}


function saveCover(parsedAudioFile){
    fs.writeFile(OUTPUT_PATH, parsedAudioFile.common.picture[0].data, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
    console.log("Finished")
}

async function main() {
    while(true){
        await sleep(1000);
        updateNowPlaying()
        if(nowPlaying.title == lastPLaying.title){
    
        } else {
            saveCover(await parseFile(nowPlaying.path))
        }
        lastPLaying = nowPlaying
    }
}


main()