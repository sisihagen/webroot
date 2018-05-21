---
title: "Gentoo Binary Packages"
date: 2014-02-04
tags: "Computer"
keywords: "Gentoo, Binary, Packages, tbz2"
shorttext: "Ich stelle euch meinen Binary Packages Server zur Verfügung, gerade für schwächere Computer könnte es hilfreich sein."
cover: "computer"
draft: false
lang: de
---

Wer möchte kann meinen Gentoo Package Server nutzen und so die eigene Kompilierzeit verkürzen. 

~~~ bash
siefke $  cat /etc/portage/make.conf | grep PORTAGE_BINHOST
PORTAGE_BINHOST="http://gentoo.silviosiefke.com/packages/"
~~~
Die notwendigen <a href="http://gentoo.silviosiefke.com/stuff/etc/portage/" title="Portage Verzeichniss im etc Zweig">Einstellungen</a> und die <a href="http://gentoo.silviosiefke.com/packages.txt" title="Datenbank für die Paket Suche">Paketsuche</a>.

Mit getbinpkg als Option von emerge könnt Ihr die Pakete herunterladen mit buildpkg werden die nicht vorhanden Binary Packages als Source Paket heruntergeladen und bei euch lokal als bin Package gespeichert. 

~~~ bash
siefke $  cat /etc/portage/make.conf | grep FEATURES
FEATURES="distcc ccache buildpkg parallel-fetch getbinpkg -preserve-libs"
~~~

Mit diesen Einstellungen werden die Shellausgaben minimalisiert...

~~~bash
siefke $  cat /etc/portage/make.conf | grep EMERGE
EMERGE_DEFAULT_OPTS="--quiet-build=y --binpkg-respect-use=y"
~~~