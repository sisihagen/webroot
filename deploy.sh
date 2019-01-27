#!/bin/bash

workdir=public/dest
de=silviosiefke.de/htdocs
en=silviosiefke.com/htdocs
fr=silviosiefke.fr/htdocs
st=static.silviosiefke.com/htdocs

case "$1" in
    de)
        rsync -avuzq --delete $workdir/$de/ web:/var/www/silviosiefke.de/
    ;;

    fr)
        rsync -avuzq --delete $workdir/$fr/ web:/var/www/silviosiefke.fr/
    ;;

    en)
        rsync -avuzq --delete $workdir/$en/ web:/var/www/silviosiefke.com/
    ;;

    st)
        rsync -avuzq --delete $workdir/$st/ web:/var/www/static.silviosiefke.com/htdocs/
    ;;

    *)
        rsync -avuz $workdir/ web:/var/www/
    ;;
esac
