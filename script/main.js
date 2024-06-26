class RGB {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}
class NowPlaying {

    rgb = new RGB(0, 0, 0);
    
    
    jsonPath = "foo_now_playing.json"
    setNowPlaying(data) {
        if(data == null) return;
        this.playing = data.playing;
        this.paused = data.paused;
        this.albumArtist = data.albumartist;
        this.album = data.album;
        this.artist = data.artist;
        this.title = data.title;
        this.trackNumber = data.tracknumber;
        this.length = data.length;
        this.elapsed = data.elapsed;
        this.path = data.path;
    }

    async fetchJSON(path){
        let response = await fetch(path);
        return await response.json();
    }
    async setRGB(){
        let json = await this.fetchJSON("color.json");
        this.rgb = new RGB(json.r, json.g, json.b);
    }
    async fetchNowPlaying(){
        let json = await this.fetchJSON(this.jsonPath);
        this.setNowPlaying(json.nowplaying);
    }

    async updateNowPlaying(){
        await this.fetchNowPlaying();
        await this.setRGB();
        outline.values.title.innerHTML = this.title;
        outline.values.artist.innerHTML = this.artist;
        outline.values.album.innerHTML = this.album;
        outline.cover.src = "cover.png";
        outline.progress.style.width = this.elapsed / this.length * 100 + "%";
        outline.container.style.backgroundColor = `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 0.5)`;
    }
}

/**
 * @typedef {Object} Outline
 * @property {Object} values - An object containing elements for various track details.
 * @property {HTMLElement} values.title - The HTML element for the track title.
 * @property {HTMLElement} values.artist - The HTML element for the track artist.
 * @property {HTMLElement} values.album - The HTML element for the track album.
 * @property {HTMLImageElement} cover - The HTML image element for the album cover.
 * @property {HTMLElement} progress - The HTML element for the progress bar.
 * @property {HTMLElement} container - The HTML element for the progress bar.
 */
/**
 * @type {Outline}
 */
var outline;

/**
 * @type {NowPlaying}
 */
var nowPlaying = new NowPlaying();
document.addEventListener('DOMContentLoaded', async function() {
    outline = {
        values: {
            title: document.getElementById('title'),
            artist: document.getElementById('artist'),
            album: document.getElementById('album'),
        },
        cover: document.getElementById('cover'),
        progress: document.getElementById('progress'),
        container: document.getElementById('container'),
    }
    await nowPlaying.fetchNowPlaying();
    console.log(nowPlaying)
    update();
});

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function update(){
    nowPlaying.updateNowPlaying();
    wait(1000).then(update);
}