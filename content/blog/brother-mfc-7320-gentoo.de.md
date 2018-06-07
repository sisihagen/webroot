---
title: "Brother MFC-7320 und Gentoo"
date: 2013-09-21
tags: "Computer"
keywords: "Gentoo, Brother, Multifunktionsgerät, Fax, Gentoo, Linux, Cups"
shorttext: "Ich möchte euch kurz beschreiben wie ich den Brother MFC-7320 unter Gentoo installiert habe. Mit den entsprechenden Druckertreibern ist das einfacher als man denkt. "
cover: "computer"
draft: false
lang: de 
---

Dieses Tutorial beschreibt wie man den Brother MFC-7320 unter [Gentoo](http://www.gentoo.org "Gentoo Gnu/Linux") installiert. Für die Installation benötigen Sie Cups, die entsprechenden Druckertreiber von [Brother](http://welcome.solutions.brother.com/bsc/public_s/id/linux/en/index.html "Brother Support Website") und für den Scanner Sane. Wenn diese Vorraussetzung erfüllt sind, können wir mit der Installation beginnen. Den Drucker können Sie dann  wie gewohnt unter Cups installieren.

1.) Die folgenden Dateien solltet Ihr von der Brother Website herunterladen. 

    - brmfc7320lpr-2.0.2-1.i386.deb (LPD Druckertreiber)
    - cupswrapperMFC7320-2.0.2-1.i386.deb (Cups Druckertreiber)
    - brscan3-0.2.11-4.i386.deb (Scanner Treiber)
    - brscan-skey-0.2.4-1.i386.deb (Hotkey Treiber))

2.) Danach beginnen wir mit den entpacken und verschieben.

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

3.) Die Dateien sind entpackt und verschoben. Wir beginnen mit der eigentlichen Installation. 

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
