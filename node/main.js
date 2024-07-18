import fs from "fs"
import { parseFile } from "music-metadata"
import sharp from "sharp"
import ColorTheif from "colorthief"
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

async function updateNowPlaying(){
    try {
        const data = await fs.promises.readFile(PATH, 'utf8');
        var rawData = JSON.parse(data.replace(/^\uFEFF/, ''));
        nowPlaying = rawData.nowplaying;
    } catch (err) {
        console.error("Error parsing now playing data:", err);
        nowPlaying = null;
    }
}


async function saveCover(parsedAudioFile){
    var format = (parsedAudioFile.common.picture[0].format).replace("image/", "")
    if(format != "png"){
        parsedAudioFile.common.picture[0].data = await sharp(parsedAudioFile.common.picture[0].data).toFormat("png").toBuffer() 
    }
    fs.writeFile(OUTPUT_PATH, parsedAudioFile.common.picture[0].data, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

async function getCommonColorV2(){
    let color;
    await sleep(250);
    try{
        color = await ColorTheif.getColor(OUTPUT_PATH);
    } catch {
        console.log("Error getting color")
        return;
    }

    let rgb = {
        r: color[0],
        g: color[1],
        b: color[2]
    }
    console.log(rgb)
    fs.writeFile("./color.json", JSON.stringify(rgb), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}
async function main() {
    if(!fs.existsSync(PATH)){
        console.error("No JSON file found")
        return;
    }
    await updateNowPlaying();
    if(nowPlaying == null){
        console.error("Invalid JSON format")
        return;
    }
    if(nowPlaying.playing == 0){
        console.log("No song playing")
        return;
    }
    while(true){
        await sleep(1000);
        await updateNowPlaying()
        if(nowPlaying.title == lastPLaying.title){
    
        } else {
            await saveCover(await parseFile(nowPlaying.path))
            await getCommonColorV2()
        }
        lastPLaying = nowPlaying
    }
}


main()