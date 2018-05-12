# simple-paste

A self-hostable pastebin written in node.js using SQLite. This pastebin doesn't provide a reverse proxy, however you can set the port that it listens on and set one up yourself.

## [Demo](https://paste.vvvland.ml)

## Setup
```
git clone https://github.com/vityavv/simple-paste.git
cd simple-paste
cp sample-config.json config.json
# copy your SSL cert into this folder, under the names key.pem and cert.pem (see below for more info)
sudo node index.js # you don't need to do sudo if you set a reverse-proxy or if you're listening on a port that isn't reserved.
```

## Configuration

After cloning the project, you can copy `sample-config.json` over into `config.json` to configure your pastebin. All default files are included in .gitignore

Here is a list of elements you can config

| key | content | default |
| --- | --- | --- |
| `"database"` | The file to make the database in. | `"./database.db"` |
| `"http_port"` | The port for the http server to listen on | `80` |
| `"https"` | An object shown below. Optional | nothing |
| `"check"` | How many milliseconds between each check for expiry | `3600000` |
| `"max"` | The maximum length of a given paste, in characters | `500000` |
| `"expiry"` | The number of hours a given paste has until it expires and gets deleted. Set to `0` for endless pastes | `720` (30 days) |
| `"theme"` | The highlight.js theme to use (full list below) | `"color-brewer"` |

### `http` object
The `http` key in the JSON config is an object that goes as follows:

| key | content | default |
| --- | --- | --- |
| `"port"` | The file for the https server to listen on | `443` |
| `"key"` | Path to HTTPS SSL certificate key file (PEM format) | `"./key.pem"` |
| `"cert"` | Path to HTTPS SSL certificate file (PEM format) | `"./cert.pem"` |

### Themes to use
You can look at themes at [highlight.js's demo site](https://highlightjs.org/static/demo/), where you can select a style to see how it looks.

The list of themes goes as follows:
```
agate
androidstudio
arduino-light
arta
ascetic
atelier-cave-dark
atelier-cave-light
atelier-dune-dark
atelier-dune-light
atelier-estuary-dark
atelier-estuary-light
atelier-forest-dark
atelier-forest-light
atelier-heath-dark
atelier-heath-light
atelier-lakeside-dark
atelier-lakeside-light
atelier-plateau-dark
atelier-plateau-light
atelier-savanna-dark
atelier-savanna-light
atelier-seaside-dark
atelier-seaside-light
atelier-sulphurpool-dark
atelier-sulphurpool-light
atom-one-dark
atom-one-light
brown-paper
codepen-embed
color-brewer
darcula
dark
darkula
default
docco
dracula
far
foundation
github
github-gist
googlecode
grayscale
gruvbox-dark
gruvbox-light
hopscotch
hybrid
idea
ir-black
kimbie
kimbie
magula
mono-blue
monokai
monokai-sublime
obsidian
ocean
paraiso-dark
paraiso-light
pojoaque
purebasic
qtcreator_dark
qtcreator_light
railscasts
rainbow
routeros
school-book
solarized-dark
solarized-light
sunburst
tomorrow
tomorrow-night-blue
tomorrow-night-bright
tomorrow-night
tomorrow-night-eighties
vs2015
vs
xcode
xt256
zenburn
```
