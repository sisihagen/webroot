#!/usr/bin/env bash

if [[ -d "./public" ]]; then
  mkdir -p ./public/dest/{silviosiefke.com/htdocs,silviosiefke.de/htdocs,silviosiefke.fr/htdocs,silviosiefke.ru/htdocs,static.silviosiefke.com/htdocs/{css,img,js,fonts}};
  echo "folder created ..."
fi
