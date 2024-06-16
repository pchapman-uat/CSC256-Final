# OBS FoobarFusion

## Setup

### Foobar

#### Install Application
1. Go to the [Foobar2000 website](https://www.foobar2000.org)
2. Go to download
3. Download windows x64 or x86
4. Follow instillation wizzard
5. **Install as portable**

#### Install component
1. Download the component [here](./foo_component/readme.md)
2. Open the foobar portable instilation folder
3. Save the file in `foobar2000\components`
4. Restart Foobar2000

1. Navigate to file
2. Open preferences (ctrl+p)
3. Open components 
4. Verify that `Now Playing Simple` shows up

![](./readme_imgs/components.png)

#### Setup NowPlaying

1. Go to file
2. Go to preferences (ctrl+P)
3. Go to tools
4. Go to Now Playing Simple
5. Click the "..." to open file explorer for the path of the json file
6. Select the json file (if there is not one, name it `foo_now_playing.json`)
7. Click events
8. Check all events
9. Input the following formatting string:
```
{
	"nowplaying": {
		"playing": $replace(%isplaying%,'?','0'),
		"paused": $replace(%ispaused%,'?','0'),
		"albumartist": "$replace(%album artist%,'"','\"','\','\\')",
		"album": "$replace(%album%,'"','\"','\','\\')",
		"artist": "$replace(%artist%,'"','\"','\','\\')",
		"title": "$replace(%title%,'"','\"','\','\\')",
		"tracknumber": $add($replace(%track number%,'?','0'),0),
		"length": $replace(%length_seconds%,'?','0'),
		"elapsed": $replace(%playback_time_seconds%,'?','0'),
		"path": "$replace(%path%,'"','\"','\','\\')"
	}
}
```

![](./readme_imgs/now_playing.png)