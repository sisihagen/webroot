#!/usr/bin/env bash

as="./static/static"
st="./public/dest/static.silviosiefke.com/htdocs"

# copy static files
if [[ -d $st/css ]]; then
  rm $st/css/*.css*
  cp $as/css/* $st/css
fi

if [[ -d $st/js ]]; then
  rm $st/js/*.js
  cp $as/js/site.js $st/js/site.js
  cp ./node_modules/html5shiv/dist/html5shiv.min.js ./public/dest/static.silviosiefke.com/htdocs/js
  cp ./node_modules/picturefill/dist/picturefill.min.js ./public/dest/static.silviosiefke.com/htdocs/js
fi
