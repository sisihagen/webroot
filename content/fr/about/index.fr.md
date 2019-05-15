---
title: "À Propos"
date: 2012-05-05
draft: false
shorttext: "Voici quelques informations peut-être intéressant pour vous ..."
cover: "cover/fawkes.jpg"
lang: fr
---

#### contact

Vous pouvez me contacter sur [Twitter](https://twitter.com/SilvioSiefke "Suivez sur Twitter ...") ou contacter par [mail](mailto:siefkesilvio@gmail.com "Envoyez-moi ...").

#### d'auteur

J'ai utilisé des photos de wikipedia et Flickr (CC 4,0). Vous pouvez utiliser mes textes librement, vous n'avez pas à mettre un lien. Tu n'as pas besoin de m'Envoyer un avocat non plus.

#### État et des intérêts économiques

Avertissements les vôtres à garder, la pauvreté n'est pas seulement négatif, vous pouvez également prendre un rien. Protégez votre «propriété», puis un courrier pertinent à l'adresse ci-dessus. J'ai un lien vers différents sites juridiques qui soutiennent mon opinion ou terminer la conclusion. Si vous avez des problèmes avec un site lié, s'il vous plaît contacter l'opérateur ou le fournisseur que vous pouvez trouver sur les requêtes [Whois](https://www.whois.net "Whois"). Je n'ai pas accès à d'autres sites Web. Si vous ne comprenez pas cela, je recommande un [cours de technologie](https://www.maxicours.com/se/fiche/tech/) de réseau.

#### Web Server

Afin que vous puissiez utiliser le site j'ai besoin d'un [serveur Web](https://en.wikipedia.org/wiki/Web_server "Wikipedia explain Webserver"). J'utilise [nginx](https://nginx.org/ "Nginx Webserver") bien sûr écrit aussi des journaux. Il stocke l'IP, le temps, le système d'exploitation et le lien que vous appelez. Les données sont supprimées quotidiennement par cron.

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

#### surveillance

Je mets les cookies de suivi et la publicité est pas un. Ce site est un passe-temps. Il est financé par moi.


#### confidentialité

Les trucs de vie privée que vous trouvez [ici](https://silviosiefke.fr/imprint).
