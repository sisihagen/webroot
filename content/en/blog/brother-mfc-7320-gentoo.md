---
title: "Brother MFC-7320 and Gentoo"
date: 2013-09-21
tags: "computer"
shorttext: "The Brother MFC-7320 need some steps, but then work fantastic with Gentoo. Its great that Brother give support for Linux."
cover: "computer"
lang: en
draft: false
---

This tutorial want explain how i install the Brother MFC-7320 on [Gentoo Gnu/Linux](http://www.gentoo.org "Gentoo Gnu/Linux"). For the installation you need [Cups](https://wiki.gentoo.org/wiki/Printing "Gentoo Printing Guide") and download the files from the [Brother Website](http://www.brother.com/html/product_support/index.htm "Brother Support Site"). When you the requirement fill then we want start with the installation. When you finished this steps then you can install the printer under cups and sane should run out of box.

1.) Files we need

    - brmfc7320lpr-2.0.2-1.i386.deb (LPD Druckertreiber)
    - cupswrapperMFC7320-2.0.2-1.i386.deb (Cups Druckertreiber)
    - brscan3-0.2.11-4.i386.deb (Scanner Treiber)
    - brscan-skey-0.2.4-1.i386.deb (Hotkey Treiber))

2.) extract and move

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

3.) installation

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
