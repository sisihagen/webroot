#!/usr/bin/env bash

as="./static/static"
st="./public/dest/static.silviosiefke.com/htdocs"

# copy static files
if [[ -d $st/css ]]; then
  rsync -avuz $as/css/ $st/css/
fi

if [[ -d $st/js ]]; then
  find $st/js -type f -delete
  cp $as/js/site.js $st/js/site.js
  cp ./node_modules/html5shiv/dist/html5shiv.min.js ./public/dest/static.silviosiefke.com/htdocs/js
fi

if [[ -d $st/fonts ]]; then
  rsync -avuz $as/fonts/ $st/fonts/
fi

if [[ -d $as/downloads ]]; then
  rsync -avuz $as/downloads/ $st/downloads/
fi
