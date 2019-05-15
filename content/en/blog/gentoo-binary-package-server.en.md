---
title: "Gentoo Binary Packages"
date: 2014-02-04
tags: "computer"
shorttext: "If you search a easy way to install gentoo, i open my binary server for easy package install...."
cover: "computer"
lang: en
draft: false
---

Find my [packages](http://gentoo.silviosiefke.com/systemd/ "Binary Packages") and the [settings](http://gentoo.silviosiefke.com/etc/portage/ "/etc/portage").

~~~ bash
siefke $  cat /etc/portage/make.conf | grep PORTAGE_BINHOST
PORTAGE_BINHOST="http://gentoo.silviosiefke.com/systemd/"
~~~

~~~ bash
siefke $  cat /etc/portage/make.conf | grep FEATURES
FEATURES="ccache distcc buildpkg parallel-fetch getbinpkg -preserve-libs"
~~~

Limited the shell output ...

~~~bash
siefke $  cat /etc/portage/make.conf | grep EMERGE
EMERGE_DEFAULT_OPTS="--quiet-build=y --binpkg-respect-use=y"
~~~
