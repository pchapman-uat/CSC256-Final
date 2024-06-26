class NowPlaying {

    jsonPath = "foo_now_playing.json"
    setNowPlaying(data) {
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

    async fetchNowPlaying(){
        let response = await fetch(this.jsonPath);
        let json = await response.json();
        this.setNowPlaying(json.nowplaying);
    }

    async updateNowPlaying(){
        await this.fetchNowPlaying();
        outline.values.title.innerHTML = this.title;
        outline.values.artist.innerHTML = this.artist;
        outline.values.album.innerHTML = this.album;
        outline.cover.src = "cover.png";
        outline.progress.style.width = this.elapsed / this.length * 100 + "%";
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
        progress: document.getElementById('progress')
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