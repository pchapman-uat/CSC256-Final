import fs from "fs"
import { parseFile } from "music-metadata"
import sharp from "sharp"
import ColorTheif from "colorthief"
const PATH = "./foo_now_playing.json";

const OUTPUT_PATH = "./cover.png";

const COLORS = {
    Green:  "\x1b[32m",
    Black: "\x1b[30m",
    Red: "\x1b[31m",
    Green: "\x1b[32m",
    Yellow: "\x1b[33m",
    Blue: "\x1b[34m",
    Magenta: "\x1b[35m",
    Cyan: "\x1b[36m",
    White: "\x1b[37m",
    Gray: "\x1b[90m"
}
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

const exitTime = 3000;
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
        nowPlaying = null;
        return err;
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
        console.log(COLORS.Green+"Image file has been saved");
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
        console.log(COLORS.Green + "Color JSON has been saved")
    });
}
async function main() {
    if(!fs.existsSync(PATH)){
        console.log(COLORS.Red+"No JSON file found")
        console.log(COLORS.Yellow+`Please make sure you have a JSON file named ${PATH.replace("./","")} in the root of the parent directory of this project`)
        console.log(COLORS.Red+`Exiting Application in ${exitTime/1000}s`);
        await sleep(exitTime)
        process.exit(1)
    }
    let error = await updateNowPlaying();
    if(nowPlaying == null){
        console.log(COLORS.Red+"Invalid JSON format");
        console.log(COLORS.Yellow+`Please make sure the JSON file is valid based on the read me template`);
        console.log(COLORS.Yellow+"Please check that Foobar2000 is running")
        console.log(`${error}`)
        console.log(COLORS.Red+`Exiting Application in ${exitTime/1000}s`);
        await sleep(exitTime)
        process.exit(1);
    }
    if(nowPlaying.playing == 0){
        console.log("No song playing")
    }
    while(true){
        await sleep(1000);
        await updateNowPlaying()
        if(nowPlaying.title == lastPLaying.title || nowPlaying.playing == 0){
    
        } else {
            let file;
            try{
                file = await parseFile(nowPlaying.path)
            } catch {
                file = null;
            }
            if(file != null)  await saveCover(file)
            await getCommonColorV2()
        }
        lastPLaying = nowPlaying
    }
}


main()