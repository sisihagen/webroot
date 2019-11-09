#!/usr/bin/env bash

# folder we need
sde=./public/build/de
dde=./public/dest/silviosiefke.de/htdocs
sen=./public/build/en
den=./public/dest/silviosiefke.com/htdocs
sfr=./public/build/fr
dfr=./public/dest/silviosiefke.fr/htdocs
sru=./public/build/ru
dru=./public/dest/silviosiefke.ru/htdocs
sst=./static/static
dst=./public/dest/static.silviosiefke.com/htdocs

# clean dest folders
rm -r ./public/{build,dest}

# run hugo
hugo

# create folder
mkdir -p $dde $den $dfr $dru
mkdir -p $dst/{css,downloads,fonts,img,js}

# html clean and minify for all languages
if [[ -d $sde ]]; then
    if [[ -d $dde ]]; then
      find $sde -name "index.xml" -delete
      rm -r $sde/static
      minify --type=html -r -o $dde/ $sde/
      cp $sde/robots.txt $dde/
    fi
fi

if [[ -d $sen ]]; then
    if [[ -d $den ]]; then
      find $sen -name "index.xml" -delete
      rm -r $sen/static
      minify --type=html -r -o $den/ $sen/
      cp $sen/robots.txt $den/
    fi
fi

if [[ -d $sfr ]]; then
    if [[ -d $dfr ]]; then
      find $sfr -name "index.xml" -delete
      rm -r $sfr/static
      minify --type=html -r -o $dfr/ $sfr/
      cp $sfr/robots.txt $dfr/
    fi
fi

if [[ -d $sru ]]; then
    if [[ -d $dru ]]; then
      find $sru -name "index.xml" -delete
      rm -r $sru/static
      minify --type=html -r -o $dru/ $sru/
      cp $sru/robots.txt $dru/
    fi
fi

# copy assets
# css
if [[ -d $sst/css ]]; then
  # scss to css file and fix it with postcss
  sassc -t compressed $sst/scss/layout.scss | ./node_modules/.bin/postcss --no-map -u autoprefixer postcss-opacity postcss-flexibility > $sst/css/layout.css

  # copy files to sync directory
  rsync -avuzq $sst/css/ $dst/css/
fi

# js
if [[ -d $sst/js ]]; then
  # concat the used js files in one temporary js file
  cat ./node_modules/jquery/dist/jquery.js ./node_modules/flexibility/flexibility.js ./static/static/js/app.js > ./static/static/js/site-orig.js

  # minify the js file to the used js file in website
  ./node_modules/.bin/uglifyjs $sst/js/site-orig.js > $sst/js/site.js

  # copy used js files
  cp $sst/js/site.js $dst/js/site.js
  cp ./node_modules/html5shiv/dist/html5shiv.min.js $dst/js
fi

# fonts
if [[ -d $sst/fonts ]]; then
  rsync -avuzq $sst/fonts/ $dst/fonts/
fi

# downloads
if [[ -d $sst/downloads ]]; then
  rsync -avuzq $sst/downloads/ $dst/downloads/
fi

# images
wdir="./static/static/img/"
odir="./public/dest/static.silviosiefke.com/htdocs/img/"
jpgo="$(find $wdir -name "*.jpg" -mtime -1 -type f -exec jpegoptim -q {} \;)"
pngo="$(find $wdir -name "*.png" -mtime -1 -type f -exec pngfix -o -q {} \;)"
webp="$(find $wdir -iregex ".*\.\(jpg\|png\|jpeg\)$" -mtime -1 -type f | parallel -eta cwebp -quiet {} -o {.}.webp)"

if [[ $jpgo -eq 0 && $pngo -eq 0 && $webp -eq 0  ]] ; then
  rsync -avuzq $wdir $odir
fi
