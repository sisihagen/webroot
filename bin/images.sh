#!/usr/bin/env bash

wdir="./static/static/img/"
odir="./public/dest/static.silviosiefke.com/htdocs/img/"
jpgo="$(find $wdir -name "*.jpg" -mtime -1 -type f -exec jpegoptim -q {} \;)"
pngo="$(find $wdir -name "*.png" -mtime -1 -type f -exec pngfix -o -q {} \;)"
webp="$(find $wdir -iregex ".*\.\(jpg\|png\|jpeg\)$" -mtime -1 -type f | parallel -eta cwebp {} -o {.}.webp)"

if [[ $jpgo -eq 0 && $png0 -eq 0 && $webp -eq 0  ]] ; then
  rsync -avuzq $wdir $odir
fi
