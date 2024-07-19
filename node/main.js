import fs from "fs"
import { parseFile } from "music-metadata"
import sharp from "sharp"
import ColorTheif from "colorthief"
import NowPlaying from "../classes/NowPlaying.js";

/**
 * File path of the now playing JSON file (default: "./foo_now_playing.json").
 */
const PATH = "./foo_now_playing.json";

/**
 * File path of the output image file (default: "./cover.png").
 */
const OUTPUT_PATH = "./cover.png";

/**
 * Command Line Syntax for colors
 */
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

/**
 * Duration in miliseconds to wait after an error occurs
 */
const exitTime = 3000;

/**
 * Object of the last playing track
 */
const lastPLaying =  new NowPlaying();
/**
 * Object of the current playing track
 */
const nowPlaying =  new NowPlaying();
/**
 * Wait for a specified amount of time.
 * @param {Number} ms - Miliseconds to wait
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * Using the data from the pased audio file, save the cover to the specified path.
 * @param {*} parsedAudioFile - The parsed audio file, there is not an 
 * @returns {Promise<Void>} - Promise of when the cover is saved
 * @see {@link OUTPUT_PATH} - Path for the output image file
 * @see {@link https://www.npmjs.com/package/music-metadata} - Library used to parse audio files
 * @see {@link https://www.npmjs.com/package/sharp} - Library used to convert the file type
 */
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
/**
 * Get the common color from the saved image file
 * @returns {Promise<Void>} - Promise of when the color is read and saved
 * @see {@link OUTPUT_PATH} - Path for the output image file
 * @see {@link https://www.npmjs.com/package/colorthief} - Library used to get the color from the image file
 */
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
    // TODO: Change to async method
    fs.writeFile("./color.json", JSON.stringify(rgb), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(COLORS.Green + "Color JSON has been saved")
    });
}
/**
 * Main loop for the application
 * - Handles the logic for when the now playing JSON file is updated
 * - Exists under the following conditions
 * - The JSON file is not found
 * - The JSON file is not valid JSON
 * @see {@link NowPlaying.updateFromJSON} - update the now player object
 * @see {@link sleep} - Sleep for a specific amount of time
 * @see {@link getCommonColorV2} - Get the common color from the saved image file
 * @see {@link https://www.npmjs.com/package/music-metadata} - Library used to parse audio files
*/
async function main() {
    if(!fs.existsSync(PATH)){
        console.log(COLORS.Red+"No JSON file found")
        console.log(COLORS.Yellow+`Please make sure you have a JSON file named ${PATH.replace("./","")} in the root of the parent directory of this project`)
        console.log(COLORS.Red+`Exiting Application in ${exitTime/1000}s`);
        await sleep(exitTime)
        process.exit(1)
    }
    let error = await nowPlaying.updateFromJSON(PATH);
    console.log(nowPlaying)
    if(error){
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
        await nowPlaying.updateFromJSON(PATH)
        if(nowPlaying.title == lastPLaying.title || nowPlaying.playing == 0){
    
        } else {
            console.log("New song playing")
            let file;
            try{
                file = await parseFile(nowPlaying.path)
            } catch {
                file = null;
            }
            if(file != null)  await saveCover(file)
            await getCommonColorV2()
        }
        lastPLaying.setNowPlaying(nowPlaying)
    }
}


main()