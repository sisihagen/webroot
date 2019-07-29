---
title: "Informationen"
date: 2012-05-05
draft: false
shorttext: "Informationen zu meiner Website und dem Kleingedruckten...."
cover: "cover/fawkes.jpg"
lang: de
---

#### Kontakt

Kontakt bitte über [Twitter](https://twitter.com/SilvioSiefke "Folge mir auf Twitter ..."), oder sendet mir eine [Mail](mailto:siefkesilvio@gmail.com "Schreib mir ...")

#### Urheberrecht

Die Texte können Sie frei verwenden. Die Bilder stammen von Wikipedia oder Flickr. <a href="https://creativecommons.org/licenses/by/4.0/&quot;%20title=&quot;Lizenz&quot;" rel=nofollow>CC 4.0</a>

#### Interessen

Abmahnungen ohne vorherigen Kontakt lehne ich ab (§254 BGB Schadensminderungspflicht). Sie können Ihr "Eigentum" durch einfachen Kontakt wie oben genannt ausreichend schützen. Armut hat auch seine Vorteile. Sollten Sie Probleme mit verlinkten Websites haben, wenden Sie sich an den entsprechenden Betreiber. Ich habe keinen Einfluss auf fremde Websites, sollten Sie hier Verständnis Probleme haben versuchen Sie es mit einer [Whois](https://www.whois.net "Whois") Auskunft, oder gleich einer Schulung der Netzwerktechnik.

#### Webserver

Damit die Websites ausgeliefert werden können benötigt man einen [webserver](https://de.wikipedia.org/wiki/Webserver "Wikipedia @ Webserver"). Ich nutze [Nginx](https://nginx.org/ "Nginx Webserver") welcher Ihren Besuch mit der IP, der Herkunft, den aufgerufenen Link, der Zeit und dem Betriebssystem speichert. Diese Logfiles werden täglich gelöscht.

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


#### Überwachung

Die Website ist ein privates Projekt, ein Hobby. Es erfolgt kein Tracking, keine Cookies und Werbung nutze ich nicht. Hobbys sollte man selbst finanzieren, Ihr Adblocker sollte nichts finden, Ublock könnte den Link zu Twitter löschen.

#### Datenschutz

Die Datenschutzerklärung finden Sie [hier](https://silviosiefke.de/imprint/ "Datenschutzerklärung").
