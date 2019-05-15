---
title: "Gentoo et OpenVZ"
date: 2012-02-26
tags: "ordinateur"
shorttext: "OpenVZ de base du serveur? Alors vous devriez essayer d'installer Gentoo ..."
cover: "computer"
lang: fr
draft: false
---

Ce tutoriel vous expliquera l'installation de [Gentoo](http://www.gentoo.org "Gentoo Gnu/Linux") dans un conteneur [OpenVZ](http://openvz.org/ "OpenVZ"). Cette installation a exécuter sur un Strato Vserver. Je ne donne aucune garantie d'exécution et vous ne devenez pas de problèmes. Pour cette procédure, vous devez une console de sauvetage et vous devez connaître le Mont point de votre Vserver Harddisk. Dans cet exemple, le disque dur est monté sur/Repair.

~~~ bash
siefke $ cp /repair/etc/mtab /root/mtab.old
siefke $ cd /repair ; rm -rf *
siefke $ wget http://yourmirror/stage3-i686-date.tar.bz2 
siefke $ wget http://yourmirror/portage-latest.tar.bz2
siefke $ tar xvjpf stage4-*.tar.bz2
siefke $ tar xvjf portage*.tar.bz2
siefke $ cp /etc/resolv.conf /repair/etc/resolv.conf
siefke $ cp /root/mtab.old /repair/etc/mtab
siefke $ mount -t proc proc /repair/proc
siefke $ mount -o bind /dev /repair/dev
siefke $ cd / ; chroot /repair
siefke $ env-update ; source /etc/profile
siefke $ cp /usr/share/zoneinfo/Europe/Berlin /etc/localtime
siefke $ emerge --sync
siefke $ passwd
siefke $ /etc/make.conf (an das System anpassen)
siefke $ /etc/locale.gen (en_US.UTF-8 UTF-8)
siefke $ locale-gen
siefke $ nano /etc/fstab (only /proc und /dev/pts)
siefke $ nano /etc/conf.d/hostname
siefke $ nano /etc/conf.d/net (the network settings)
siefke $ cd /etc/init.d ; ln -s net.lo net.venet0 ; rc-update add net.venet0 default
siefke $ nano -w /etc/hosts
siefke $ nano /etc/ssh/sshd_config (Port 22, ListenAddress 0.0.0.0)
siefke $ nano /etc/rc.conf (rc_sys="openvz")
siefke $ nano/etc/inittab (Einen Terminal aktivieren)
siefke $ emerge syslog-ng vixie-cron iproute2
siefke $ rc-update add syslog-ng default ; rc-update add vixie-cron default; rc-update add sshd default
~~~

Ma configuration de réseau à titre d'exemple:

~~~ bash
siefke $ cat /etc/conf.d/net
config_venet0="ihreIP/32 broadcast 0.0.0.0"
routes_venet0="169.254.0.0/16 dev venet0 scope link
default via 169.254.0.0 dev venet0"
dns_servers_venet0="81.169.163.106 85.214.7.22"
dns_domain_venet0="stratoserver.net"
nis_domain_venet0="stratoserver.net"
~~~
