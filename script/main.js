class RGB {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    getRGB() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
    getRGBA(a) {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${a})`;
    }
    inverse(){
        return new RGB(255 - this.r, 255 - this.g, 255 - this.b);
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
        try{
            return await response.json();
        }catch(e){
            console.log(e);
            return null;
        }
    }
    async setRGB(){
        let json = await this.fetchJSON("color.json");
        this.rgb = new RGB(json.r, json.g, json.b);
    }
    async fetchNowPlaying(){
        let json = await this.fetchJSON(this.jsonPath);
        if(json == null) return;
        this.setNowPlaying(json.nowplaying);
    }

    async updateNowPlaying(){
        await this.fetchNowPlaying();
        await this.setRGB();
        outline.values.title.innerHTML = this.title;
        outline.values.artist.innerHTML = this.artist;
        outline.values.album.innerHTML = this.album;
        outline.cover.src = "cover.png?"+this.title;
        outline.progress.style.width = this.elapsed / this.length * 100 + "%";
        outline.container.style.backgroundColor = this.rgb.getRGBA(0.5);
        outline.progress.style.backgroundColor = this.rgb.inverse().getRGB();
        outline.values.checkForScroll();
    }
}


class Values {
    setValues(){
        this.title = document.getElementById('title');
        this.artist = document.getElementById('artist');
        this.album = document.getElementById('album');
    }
    checkForScroll(){
        if(this.title.offsetWidth > this.title.parentElement.offsetWidth){
            this.title.classList.add('scroll');
        } else {
            this.title.classList.remove('scroll');
        }
        if(this.artist.offsetWidth > this.artist.parentElement.offsetWidth){
            this.artist.classList.add('scroll');
        } else {
            this.artist.classList.remove('scroll');
        }
        if(this.album.offsetWidth > this.album.parentElement.offsetWidth){
            this.album.classList.add('scroll');
        } else {
            this.album.classList.remove('scroll');
        }
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
class Outline {
    setOutline(){
        this.values = new Values();
        this.values.setValues();
        this.cover = document.getElementById('cover');
        this.progress = document.getElementById('progress');
        this.container = document.getElementById('container');
    }
}
/**
 * @type {Outline}
 */
var outline;

/**
 * @type {NowPlaying}
 */



var nowPlaying = new NowPlaying();
document.addEventListener('DOMContentLoaded', async function() {
    outline = new Outline();
    outline.setOutline()
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