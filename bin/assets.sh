#!/usr/bin/env bash

if [[ -d "./public/dest/static.silviosiefke.com/htdocs" ]]; then
  rsync -avuzq --exclude "img" --exclude "scss" --exclude "app.js" --exclude "modernizr-custom.js" ./static/static/ ./public/dest/static.silviosiefke.com/htdocs/
  echo "done ..."

else

  mkdir -p ./public/dest/static.silviosiefke.com/htdocs
  rsync -avuzq --exclude "img" --exclude "scss" --exclude "app.js" --exclude "modernizr-custom.js" ./static/static/ ./public/dest/static.silviosiefke.com/htdocs/
  echo "folder create and copied ..."

fi
