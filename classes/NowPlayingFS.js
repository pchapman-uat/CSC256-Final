import NowPlaying from "./NowPlaying.js";
import fs from "fs";
export default class NowPlayingFS extends NowPlaying {
    async updateFromJSON(path){
        try {
            const data = await fs.promises.readFile(path, 'utf8');
            var rawData = JSON.parse(data.replace(/^\uFEFF/, ''));
            this.setNowPlaying(rawData.nowplaying);
            return null;
        } catch (err) {
            return err;
        }
    }
}   