import NowPlaying from "../classes/NowPlaying.js";

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
    setWithTreshold(amnt){
        this.r = this.r < amnt ? this.r + amnt : this.r - amnt;
        this.g = this.g < amnt ? this.g + amnt : this.g - amnt;
        this.b = this.b < amnt ? this.b + amnt : this.b - amnt;
    }
    clone(old){
        this.r = old.r;
        this.g = old.g;
        this.b = old.b;
        return this;
    }
    get radialGradient(){
        let color2 = new RGB().clone(this);
        color2.setWithTreshold(25);

        return `radial-gradient(${this.getRGBA(0.75)}, ${color2.getRGBA(0.75)})`;
    }
}
class NowPlaying2 extends NowPlaying {
    previousTitle = "";

    rgb = new RGB(0, 0, 0);
    
    
    jsonPath = "foo_now_playing.json"
    
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
        outline.progress.style.width = this.elapsed / this.length * 100 + "%";
        outline.values.checkForScroll();
        outline.container.style.backgroundImage = this.rgb.radialGradient;
        outline.progress.style.backgroundColor = this.rgb.inverse().getRGB();
        outline.cover.src = "cover.png?"+this.elapsed;
        outline.values.elapsed.innerHTML = this.formatTime(this.elapsed);
        outline.values.remaining.innerHTML = this.formatTime(this.length-this.elapsed);
        if(this.title == this.previousTitle) {
            console.log("Same Song")
            return;
        }

        console.log(this.previousTitle);

        let animationMS = 1500;
        let animationSecs = animationMS / 1000;
        if(this.previousTitle != ""){
            outline.container.style.animation = `fadeOut ${animationSecs}s`;
            await wait(animationMS);
            console.log("done fadeOut");
        }
        outline.values.title.innerHTML = this.title;
        outline.values.artist.innerHTML = this.artist;
        outline.values.album.innerHTML = this.album;
        outline.container.style.animation = `fadeIn ${animationSecs}s`;
        this.previousTitle = this.title;
        await wait(animationMS);
        outline.container.style.animation = "none";
        console.log("done fadeIn");
    }
    formatTime(timeInt){
        let minutes = Math.floor(timeInt / 60);
        let seconds = Math.floor(timeInt % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}


class Values {
    setValues(){
        this.title = document.getElementById('title');
        this.artist = document.getElementById('artist');
        this.album = document.getElementById('album');
        this.elapsed = document.getElementById('elapsed');
        this.remaining = document.getElementById('remaining');
        
    }
    checkForScroll(){
        if(this.title.scrollWidth > this.title.parentElement.clientWidth){
            this.title.classList.add('scroll');
        } else {
            this.title.classList.remove('scroll');
        }
        if(this.artist.scrollWidth > this.artist.parentElement.clientWidth){
            this.artist.classList.add('scroll');
        } else {
            this.artist.classList.remove('scroll');
        }
        if(this.album.scrollWidth > this.album.parentElement.clientWidth){
            this.album.classList.add('scroll');
        } else {
            this.album.classList.remove('scroll');
        }
    }
}
/**
 * @typedef {Object} Outline
 * @property {Object} values - An object containing elements for various track details.
 * @property {HTMLImageElement} cover - The HTML image element for the album cover.
 * @property {HTMLElement} progress - The HTML element for the progress bar.
 * @property {HTMLElement} container - The HTML element for the progress bar.
 */
class Outline {
    /**
     * @type {Values} - An object containing elements for various track details.
     */
    values;
    
    /**
     * @type {HTMLImageElement}  - The HTML image element for the album cover.
     */
    cover;

    /**
     * @type {HTMLElement}  - The HTML element for the progress bar.
     */
    progress;

    /**
     * @type {HTMLElement}  - The HTML element for the container.
     */
    container;
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


var nowPlaying = new NowPlaying2();
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