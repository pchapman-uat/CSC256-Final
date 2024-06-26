import fs from "fs"
import { parseFile } from "music-metadata"
import { PNG } from "pngjs"
import sharp from "sharp"

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
    
        var rawData = JSON.parse(data.replace(/^\uFEFF/, ''))
        try{
            nowPlaying = rawData.nowplaying;
        } catch {
            console.log("No data")
        }
    })
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
        commonColor(parsedAudioFile.common.picture[0].data)
    });
}

function commonColor(rawPNG){
    console.log(rawPNG.length)
    var albumCover = new PNG.sync.read(rawPNG);
    var data = albumCover.data;
    var count = 0;
    let color = {
        r: 0,
        g: 0,
        b: 0,
    }
    
    for (let i = 0; i < data.length; i += 4) {
        count++;
        color.r += data[i];
        color.g += data[i + 1];
        color.b += data[i + 2];
      }
    color.r = Math.floor(color.r / count)
    color.g = Math.floor(color.g / count)
    color.b = Math.floor(color.b / count)

    console.log(color)
    fs.writeFile("./color.json", JSON.stringify(color), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
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