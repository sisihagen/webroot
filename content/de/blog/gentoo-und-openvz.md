---
title: "Gentoo und OpenVZ"
date: 2012-02-26
tags: "Computer"
keywords: "OpenVZ, Strato, Vserver, Virtualisierung, Gentoo, RedHat, Suse, Debian"
shorttext: "Es gibt ja viele Anbieter die OpenVZ zur Virtualisierung nutzen. Bietet der Anbieter noch eine Rettungskonsole, könnte man Gentoo nutzen."
cover: "computer"
draft: false
lang: de
---


Dieses Tutorial erklärt die Installation von [Gentoo](http://gentoo.org "Gentoo Gnu/Linux") in einen [OpenVZ](http://openvz.org "OpenVZ") Container. Ich habe diese Installation bei Strato selbst erfolgreich umgesetzt, kann aber keine Garantie übernehmen. Für diese Schritte benötigen Sie eine Rescue Konsole und der Mountpoint Ihres Vservers sollte Ihnen bekannt sein. Bei diesem Tutorial verwende ich den Mountpoint /repair, wie es bei Strato der Fall war.

~~~ bash
$ cp /repair/etc/mtab /root/mtab.old
$ cd /repair ; rm -rf *
$ curl http://yourmirror/stage3-i686-date.tar.bz2 > stage3-i686-date.tar.bz2
$ curl http://yourmirror/portage-latest.tar.bz2 > portage-latest.tar.bz2
$ tar xvjpf stage4-*.tar.bz2
$ tar xvjf portage*.tar.bz2
$ cp /etc/resolv.conf /repair/etc/resolv.conf
$ cp /root/mtab.old /repair/etc/mtab
$ mount -t proc proc /repair/proc
$ mount -o bind /dev /repair/dev
$ cd / ; chroot /repair
$ env-update ; source /etc/profile
$ cp /usr/share/zoneinfo/Europe/Berlin /etc/localtime
$ emerge --sync
$ passwd
$ /etc/make.conf (an das System anpassen)
$ /etc/locale.gen (en_US.UTF-8 UTF-8)
$ locale-gen
$ nano /etc/fstab (only /proc und /dev/pts)
$ nano /etc/conf.d/hostname
$ nano /etc/conf.d/net (the network settings)
$ cd /etc/init.d ; ln -s net.lo net.venet0 ; rc-update add net.venet0 default
$ nano -w /etc/hosts
$ nano /etc/ssh/sshd_config (Port 22, ListenAddress 0.0.0.0)
$ nano /etc/rc.conf (rc_sys="openvz")
$ nano/etc/inittab (Einen Terminal aktivieren)
$ emerge syslog-ng vixie-cron iproute2
$ rc-update add syslog-ng default ; rc-update add vixie-cron default; rc-update add sshd default
~~~

Neustart und hoffen, falls Fehler vorkommen im Rescue Modus starten und Logs checken,Die "Netzwerk"konfiguration sollte so ähnlich wie nachfolgend aussehen.

~~~ bash
$ cat /etc/conf.d/net
config_venet0="ihreIP/32 broadcast 0.0.0.0"
routes_venet0="169.254.0.0/16 dev venet0 scope link
default via 169.254.0.0 dev venet0"
dns_servers_venet0="81.169.163.106 85.214.7.22"
dns_domain_venet0="stratoserver.net"
nis_domain_venet0="stratoserver.net"
~~~
