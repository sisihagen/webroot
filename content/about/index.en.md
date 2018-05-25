---
title: "Informationen"
date: 2012-05-05
draft: false
shorttext: "Here come some information maybe be interesting for you ..."
cover: "cover/fawkes.jpg"
lang: en
---

#### contact

You can me contact over [Twitter](https://twitter.com/SilvioSiefke "Follow on twitter") or with [mail](mailto:siefkesilvio@gmail.com "Email me...")

#### copyright

I used photos from Wikipedia and flickr (CC 4.0). You can use my texts freely, you don't have to put a link. You don't need to send me a lawyer either.

#### State and Economic Interests

Warnings yours to keep, poverty is not only negative, you can also take a nothing. Protect your “property”, then a relevant mail to the above address. I link to different legal sites that support my opinion or complete the conclusion. If you have problems with a linked site, please contact the operator or provider you can find on [Whois](https://www.whois.net "Whois") queries. I do not have access to other websites. If you do not understand this, I recommend a [course](https://www.itonlinelearning.com/blog/networking-courses-for-beginners/ "Network Courses for Beginners") of network technology.

#### Webserver

So that you can use the website I need a [webserver](https://en.wikipedia.org/wiki/Web_server "Wikipedia explain Webserver"). I use [nginx](https://nginx.org/ "Nginx Webserver") of course also writes logs. It stores the IP, time, operating system and the link that you are calling. The data is deleted daily by Cronjob.

~~~ bash
#!/bin/bash

wd=/var/www
de=silviosiefke.de/logs
en=silviosiefke.com/logs
fr=silviosiefke.fr/logs

rm $wd/$de/* ; touch $wd/$de/access.log $wd/$de/error.log ; chown -R siefke:siefke $wd/$de/
rm $wd/$en/* ; touch $wd/$en/access.log $wd/$en/error.log ; chown -R siefke:siefke $wd/$en/
rm $wd/$fr/* ; touch $wd/$fr/access.log $wd/$fr/error.log ; chown -R siefke:siefke $wd/$fr/

systemctl restart nginx

exit 0
~~~

#### policing

You have certainly heard of Cookie, advertising, and Tracker. All of these techniques I do not use. I run a purely private site that contain my thoughts, opinions and descriptions. I follow no commercial interests and desires. This site is a hobby, a hobby funded self or let it.

#### privacy 

The Privacy Doc you find [here](http://silviosiefke.com/imprint "Privacy")
