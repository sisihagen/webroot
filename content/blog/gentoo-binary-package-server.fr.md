---
title: "Gentoo Binary Packages"
date: 2014-02-04
tags: "ordinateur"
shorttext: "Je vous présente mon serveur de paquets binaires, en particulier pour les ordinateurs les plus faibles, il pourrait être utile."
cover: "computer"
lang: fr
draft: false
---

~~~ bash
siefke $  cat /etc/portage/make.conf | grep PORTAGE_BINHOST
PORTAGE_BINHOST="http://gentoo.silviosiefke.com/packages/"
~~~

~~~ bash
siefke $  cat /etc/portage/make.conf | grep FEATURES
FEATURES="distcc ccache buildpkg parallel-fetch getbinpkg -preserve-libs"
~~~

Avec ces réglages, les dépenses sont réduites au minimum Shell ...

~~~bash
siefke $  cat /etc/portage/make.conf | grep EMERGE
EMERGE_DEFAULT_OPTS="--quiet-build=y --binpkg-respect-use=y"
~~~