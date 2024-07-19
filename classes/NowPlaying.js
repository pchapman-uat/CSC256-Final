import fs from "fs"
export default class NowPlaying {
    /**
     * Indicates if the track is current loaded. 1 if loaded, 0 if not.
     * @type {?number}
     */
    playing = null
    /**
     * Indicates if the track is paused. 1 if paused, 0 if not.
     * @type {?number}
     */
    paused = null
    /**
     * The album artist of the track.
     * @type {?string}
     */
    albumartist = null
    /**
     * The album of the track.
     * @type {string|null}
     */
    album = null
    /**
     * The artist of the track.
     * @type {string|null}
     */
    artist = null
    /**
     * The title of the track.
     * @type {?string}
     */
    title = null
    /**
     * The track number of the track.
     * @type {?number}
     */
    tracknumber = null
    /**
     * The length of the track in seconds.
     * @type {?number}
     */
    length = null
    /**
     * The elapsed time of the track in seconds.
     * @type {?number}
     */
    elapsed = null
    /**
     * The file path of the track.
     * @type {?string}
     */
    path = ""
    /**
     * Set the values of the object
     * @param {?NowPlaying} data - A NowPlaying object, or JSON data of the same structure. Value can be null and will stop if it is.
     */
    setNowPlaying(data) {
        if(data == null) return;
        this.playing = data.playing;
        this.paused = data.paused;
        this.albumartist = data.albumartist;
        this.album = data.album;
        this.artist = data.artist;
        this.title = data.title;
        this.tracknumber = data.tracknumber;
        this.length = data.length;
        this.elapsed = data.elapsed;
        this.path = data.path;
    }

    /**
     * 
     * @param {String} path - File path string for the JSON file, can be a realitive path
     * @returns {Promise<?Error>} - Promise of the JSON data, or null if there is an error.
     */
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