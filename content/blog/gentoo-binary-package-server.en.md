---
title: "Gentoo Binary Packages"
date: 2014-02-04
tags: "computer"
shorttext: "If you search a easy way to install gentoo, i open my binary server for easy package install...."
cover: "computer"
lang: en
draft: false
---

~~~ bash
siefke $  cat /etc/portage/make.conf | grep PORTAGE_BINHOST
PORTAGE_BINHOST="http://gentoo.silviosiefke.com/packages/"
~~~

~~~ bash
siefke $  cat /etc/portage/make.conf | grep FEATURES
FEATURES="ccache distcc buildpkg parallel-fetch getbinpkg -preserve-libs"
~~~

Limited the shell echo...

~~~bash
siefke $  cat /etc/portage/make.conf | grep EMERGE
EMERGE_DEFAULT_OPTS="--quiet-build=y --binpkg-respect-use=y"
~~~