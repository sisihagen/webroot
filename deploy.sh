#!/bin/bash

workdir=public/dest
de=silviosiefke.de/htdocs
en=silviosiefke.com/htdocs
fr=silviosiefke.fr/htdocs
st=static.silviosiefke.com/htdocs

case "$1" in
    de)
        rsync -avuzq --delete $workdir/$de/ rb2:/var/www/silviosiefke.de/
        rsync -avuzq --delete $workdir/$de/ web:/var/www/silviosiefke.de/
    ;;

    fr)
        rsync -avuzq --delete $workdir/$fr/ rb2:/var/www/silviosiefke.fr/
        rsync -avuzq --delete $workdir/$fr/ web:/var/www/silviosiefke.fr/
    ;;

    en)
        rsync -avuzq --delete $workdir/$en/ rb2:/var/www/silviosiefke.com/
        rsync -avuzq --delete $workdir/$en/ web:/var/www/silviosiefke.com/
    ;;

    st)
        rsync -avuzq --delete $workdir/$st/ rb2:/var/www/static.silviosiefke.com/htdocs/
        rsync -avuzq --delete $workdir/$st/ web:/var/www/static.silviosiefke.com/htdocs/
    ;;

    *)
        rsync -avuz $workdir/ rb2:/var/www/
        rsync -avuz $workdir/ web:/var/www/
    ;;
esac
