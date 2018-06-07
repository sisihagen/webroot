---
title: "Brother MFC-7320 et Gentoo"
date: 2013-09-21
tags: "ordinateur"
shorttext: "Brother MFC-7320, le polyvalent parmi Gentoo GNU / Linux ... Je décrire la manière."
cover: "computer"
lang: fr
draft: false
---

Ce tutoriel explique comment installer une machine multifonction de Brother sur un système [Gentoo Linux](http://www.gentoo.org "Gentoo Gnu/Linux"). Pour l'installation, vous devez [Cups](https://wiki.gentoo.org/wiki/Printing "Cups et Gentoo") et les pilotes associés de [Brother](http://www.brother.fr/services-et-supports "Brother - SERVICES ET SUPPORTS").

1.) Les fichiers suivants doivent vous télécharger à partir du site Web de Brother. 

    - brmfc7320lpr-2.0.2-1.i386.deb (LPD Druckertreiber)
    - cupswrapperMFC7320-2.0.2-1.i386.deb (Cups Druckertreiber)
    - brscan3-0.2.11-4.i386.deb (Scanner Treiber)
    - brscan-skey-0.2.4-1.i386.deb (Hotkey Treiber))

2.) Puis nous commençons à déballer et déplacer.

~~~ bash
siefke $ ar x  brmfc7320lpr-2.0.2-1.i386.deb
siefke $ tar xf data.tar.gz ; rm *.tar.gz debian-history brmf7320lpr*
siefke $ ar x cupswrapperMFC7320-2.0.2-1.i386.deb
siefke $ tar xf data.tar.gz ; rm *.tar.gz debian-history cupswrapper*
siefke $ ar x brscan3-0.2.11-4.i386.deb>
siefke $ tar xf data.tar.gz ; rm *.tar.gz debian-history brscan3*
siefke $ ar x brscan-skey-0.2.4-1.i386.deb
siefke $ tar xf data.tar.gz ; rm *.tar.gz debian-history brscan*
siefke $ su -c "mv usr opt var /"
~~~

3.) Les fichiers sont décompressés et se déplacent. Nous commençons avec l'installation proprement dite.

~~~ bash
siefke $ cd /etc/udev/rules.d
siefke $ wget https://www.silviosiefke.com/downloads/70-libsane.rules
siefke $ cd /etc/sane.d
siefke $ wget https://www.silviosiefke.com/downloads/mfc7320.conf
siefke $ cd /usr/local/Brother/cupswrapper
siefke $ chmod +x cupswrapperMFC7320-2.0.2
siefke $ ./cupswrapperMFC7320-2.0.2 -i
siefke $ ../sane/setupSaneScan3 -i
siefke $ cd /usr/libexec/cups/filter
siefke $ i686: ln -s /usr/lib/cups/filter/brlpdwrapperMFC7320 .
siefke $ x86_64: ln -s /usr/lib64/cups/filter/brlpdwrapperMFC7320 .
siefke $ udevadm control --reload-rules
~~~

{{< image srcwebp="/static/img/content/2013/brother_mfc.webp" srcalt="/static/img/content/2013/brother_mfc.jpg" title="Brother MFC-7320" >}}

{{< image srcwebp="/static/img/content/2013/cups.webp" srcalt="/static/img/content/2013/cups.png" title="Cups" >}}
