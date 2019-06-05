#!/bin/bash

workdir=public/dest
de=silviosiefke.de/htdocs
en=silviosiefke.com/htdocs
fr=silviosiefke.fr/htdocs
ru=silviosiefke.ru/htdocs
st=static.silviosiefke.com/htdocs

case "$1" in
    de)
        rsync -avuzq --delete $workdir/$de/ web:/var/www/silviosiefke.de/htdocs/
    ;;

    fr)
        rsync -avuzq --delete $workdir/$fr/ web:/var/www/silviosiefke.fr/htdocs/
    ;;

    en)
        rsync -avuzq --delete $workdir/$en/ web:/var/www/silviosiefke.com/htdocs/
    ;;

    ru)
        rsync -avuzq --delete $workdir/$ru/ russia:/var/www/silviosiefke.ru/htdocs/
    ;;

    st)
        rsync -avuzq --delete $workdir/$st/ web:/var/www/static.silviosiefke.com/htdocs/
        rsync -avuzq --delete $workdir/$st/ russia:/var/www/static.silviosiefke.com/htdocs/
    ;;

    *)
        rsync -avuz --exclude "silviosiefke.ru" --exclude "scss" $workdir/ web:/var/www/
        rsync -avuz --exclude "scss" --exclude "silviosiefke.de" --exclude "silviosiefke.fr" --exclude "silviosiefke.com" $workdir/ ru-web:/var/www/
    ;;
esac
