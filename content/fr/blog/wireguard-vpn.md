---
title: "Wireguard VPN"
date: 2019-04-28
tags: "Ordinateur"
keywords: "WireGuard, VPN, IPv6, IPv4, Arch Linux, Arch, DNS, réseau privé virtuel, cryptographie, cryptage"
shorttext: "OpenVPN a été hier, Wireguard est la nouvelle, moderne, simple et rapide solution du XXIe siècle"
cover: "computer"
draft: false
lang: fr
---

J’ai récemment découvert l’impressionnant [Wireguard](https://www.wireguard.com/ "rapide, moderne, Secure VPN Tunnel") tunnel VPN et j’ai été impressionné. Wireguard est un simple, basé sur le noyau, l’état de l’art VPN qui se trouve aussi être ridiculement rapide et utilise des principes cryptographiques modernes que toutes les autres solutions VPN Highspeed manquent.

[OpenVPN](https://openvpn.net/ "Solutions logicielles VPN & services pour les entreprises | OpenVPN") utilisé pour être ma solution VPN de choix, mais après quelques semaines avec Wireguard, les choses ont changé. Voir les diagrammes de comparaison de performance effectués par l’auteur de Wireguard, [Jason Donenfeld] (https://www.zx2c4.com/ "Jason Donenfeld"). 

{{< image srcwebp="/static/img/content/2019/55.webp" srcalt="/static/img/content/2019/55.jpg" title="Wireguard Performance" >}}

Voici quelques-unes des raisons pour lesquelles Wireguard souffle la compétition:

  -Il vise à être aussi facile à configurer et à déployer que SSH.
  -Il est capable d’itinérance entre les adresses IP (particulièrement utile pour empêcher les connexions abandonnées quand vous avez le feuilletée Internet).
  -Utilise la cryptographie de pointe.
  -Il est destiné à être facilement mis en œuvre en très peu de lignes de code, et facilement vérifiable pour les vulnérabilités de sécurité.
  -Une combinaison de primitives cryptographiques à très grande vitesse et le fait que WireGuard vit à l’intérieur du noyau Linux signifie que la mise en réseau sécurisée peut être très grande vitesse.
  -Stealth-ne répond pas à tous les paquets non authentifiés et les deux pairs deviennent silencieux quand il n’y a aucune donnée à échanger.

J’espère que vous aussi ont été vendus donc nous allons entrer dans le processus de mise en place.

{{< image srcwebp="/static/img/content/2019/56.webp" srcalt="/static/img/content/2019/56.jpg" title="Typical VPN Networking" >}}

  -[Arch Linux](https://www.Archlinux.org/ "une distribution simple et légère") en tant que serveur VPN Wireguard
  -L’interface Internet face sur le serveur est eth0.
  -Arch Linux en tant que client Notebook
  -192.168.2.1 IP du serveur
  -Notebook IP 192.168.2.2
  -[Unbound](https://NLnetLabs.nl/Projects/Unbound/about/ "non lié est un résolveur DNS de validation, récursif, Caching de mise en cache") pour une sécurité supplémentaire.

#### Installation

  1. Installez WireGuard sur le serveur VPN.
  2. générez des clés de serveur et de client.
  3. générez des configs de serveur et de client.
  4. activez l’interface WireGuard sur le serveur.
  5. activez le transfert IP sur le serveur.
  6. Configurez les règles de pare-feu sur le serveur.
  7. Configurez DNS.
  8. Configurez Wireguard sur les clients.



#### Instal Wireguard sur le serveur

```bash
pacman -S wireguard-tools wireguard-arch
```

#### Générer les clés

```bash
cd /etc/wireguard
umask 077
wg genkey | tee server_private_key | wg pubkey > server_public_key
wg genkey | tee client_private_key | wg pubkey > client_public_key
```

#### Générer la configuration du serveur

Créez /etc/wireguard/wg0.conf et remplissez-le avec le contenu de suivi!

```bash
[Interface]
Address = 192.168.2.1/24
SaveConfig = true
PrivateKey = <insert server_private_key>
ListenPort = 51820

[Peer]
PublicKey = <insert client_public_key>
AllowedIPs = 192.168.2.2/32
```

wg0. conf se traduira par une interface nommée wg0 par conséquent, vous pouvez renommer le fichier si vous avez envie quelque chose de différent.

AllowedIPs = 192.168.2.2/32 fournit une sécurité renforcée en veillant à ce que seul un client avec le 10.200.200.2 IP et la clé privée correcte sera autorisé à s’authentifier sur le tunnel VPN.

ListenPort est le port UDP à écouter. Un autre peut être utilisé.

#### Générer la configuration du client

Créez /etc/wireguard/wg0-client.conf et remplissez-le avec le contenu de suivi.

```bash
[Interface]
Address = 192.168.2.2/32
PrivateKey = <insert client_private_key>
DNS = 192.168.2.1

[Peer]
PublicKey = <insert server_public_key>
Endpoint = <insert vpn_server_address>:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 21
```

Comme pour le cas du serveur, wg0-client. conf se traduira par une interface nommée wg0-client afin que vous puissiez renommer le fichier si vous avez envie de quelque chose de différent.

AllowedIPs = 0.0.0.0/0 autorisera et achemine tout le trafic sur le client via le tunnel VPN. Cela peut être réduit si vous voulez seulement un peu de trafic pour aller sur VPN.

DNS = 192.168.2.1 va définir l’adresse IP du résolveur DNS sur notre serveur VPN. Ceci est important pour empêcher des fuites de DN quand sur le VPN.

#### Activez l’interface WireGuard sur le serveur.

Nous allons mettre en place l’interface Wireguard sur le serveur VPN comme suit:

```bash
chown -v root:root /etc/wireguard/wg0.conf
chmod -v 600 /etc/wireguard/wg0.conf
wg-quick up wg0
systemctl enable wg-quick@wg0.service #Enable the interface at boot 
```

Après cela, confirmez que vous avez une nouvelle interface nommée wg0 en exécutant ifconfig.

```language
wg0: flags=209<UP,POINTOPOINT,RUNNING,NOARP>  mtu 1420
        inet 192.168.2.1  netmask 255.255.255.255  destination 192.168.2.1
        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 1000  (UNSPEC)
        RX packets 942096  bytes 266132696 (253.8 MiB)
        RX errors 189  dropped 16  overruns 0  frame 189
        TX packets 1662808  bytes 1986213236 (1.8 GiB)
        TX errors 0  dropped 895 overruns 0  carrier 0  collisions 0
```

#### IP Forwarding

```bash
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
```

Puis aussi faire ce qui suit pour cesser d’avoir à redémarrer le serveur

```bash
sysctl -p
echo 1 > /proc/sys/net/ipv4/ip_forward
```

#### Firewall

Nous devrons configurer quelques règles [Firewall](https:/Netfilter.org/ "Firewalling, NAT et packat Manage for Linux ") pour gérer notre trafic VPN et DNS.

  - Suivi de la connexion VPN
  - Autoriser le trafic VPN entrant sur le port d’écoute
  - Autoriser le trafic DNS récursif TCP et UDP
  - Autoriser l’acheminement des paquets qui restent dans le tunnel VPN
  - Configurer NAT

```bash
iptables -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
iptables -A INPUT -p udp -m udp --dport 51820 -m conntrack --ctstate NEW -j ACCEPT
iptables -A INPUT -s 192.168.2.0/24 -p tcp -m tcp --dport 53 -m conntrack --ctstate NEW -j ACCEPT
iptables -A INPUT -s 192.168.2.0/24 -p udp -m udp --dport 53 -m conntrack --ctstate NEW -j ACCEPT
iptables -A FORWARD -i wg0 -o wg0 -m conntrack --ctstate NEW -j ACCEPT
iptables -t nat -A POSTROUTING -s 10.200.200.0/24 -o eth0 -j MASQUERADE
```

Nous souhaitons également veiller à ce que les règles demeurent persistantes à travers les rebottes.

```bash
iptables-save > /etc/iptables/iptables.rules
systemctl enable iptables.service
```

#### Configure DNS

Un problème majeur avec beaucoup de VPN mis UPS est que le DNS n’est pas fait assez bien. Cela finit par fuir la connexion client et les détails de l’emplacement. Un bon moyen de tester ceci est à travers le site Great [http://dnsleak.com/](http://dnsleak.com/ "DNS fuite test").

Nous allons donc nous assurer que notre trafic DNS est sécurisé. Après quelques recherches, j’en suis venu à la conclusion que la solution DNS non liée est une très bonne option à utiliser. Certains de ses mérites comprennent:

  - Léger et rapide
  - Facile à installer et à configurer
  - Orienté sécurité
  - Supporte DNSSEC

Nous allons le configurer de manière à contrer les fuites DNS, les attaques plus sophistiquées comme la configuration de faux proxy, les routeurs voyous et toutes sortes d’attaques MITM sur HTTPS et d’autres protocoles.

Nous faisons d’abord l’installation sur le serveur

```bash
pacman -S unbound
```

Nous avons ensuite télécharger la liste des serveurs DNS racine

```bash
curl -o /etc/unbound/root.hints https://www.internic.net/domain/named.cache
```

nano /etc/unbound/unbound.conf

```bash
server:

  num-threads: 4

  #Enable logs
  verbosity: 1

  #list of Root DNS Server
  root-hints: "/var/lib/unbound/root.hints"

  #Use the root servers key for DNSSEC
  auto-trust-anchor-file: "/var/lib/unbound/root.key"

  #Respond to DNS requests on all interfaces
  interface: 0.0.0.0
  max-udp-size: 3072

  #Authorized IPs to access the DNS Server
  access-control: 0.0.0.0/0               refuse
  access-control: 127.0.0.1               allow
  access-control: 192.168.2.0/24         allow

  #not allowed to be returned for public internet  names
  private-address: 192.168.2.0/24

  # Hide DNS Server info
  hide-identity: yes
  hide-version: yes

  #Limit DNS Fraud and use DNSSEC
  harden-glue: yes
  harden-dnssec-stripped: yes
  harden-referral-path: yes

  #Add an unwanted reply threshold to clean the cache and avoid when possible a DNS Poisoning
  unwanted-reply-threshold: 10000000

  #Have the validator print validation failures to the log.
  val-log-level: 1

  #Minimum lifetime of cache entries in seconds
  cache-min-ttl: 1800 

  #Maximum lifetime of cached entries
  cache-max-ttl: 14400
  prefetch: yes
  prefetch-key: yes

  # DNS Server
  forward-zone:
  name: "."
  forward-addr: 2a02:2970:1002::18         # Digitalcourage
  forward-addr: 46.182.19.48               # Digitalcourage  
  forward-addr: 80.241.218.68              # dismail.de
  forward-addr: 2a02:c205:3001:4558::1     # dismail.de
  forward-addr: 194.150.168.168            # AS250.net
  forward-addr: 194.150.168.169            # AS250.net
  forward-addr: 91.239.100.100             # UncensoredDNS
  forward-addr: 2001:67c:28a4::            # UncensoredDNS
  forward-addr: 89.233.43.71               # UncensoredDNS
  forward-addr: 2a01:3a0:53:53::           # UncensoredDNS
  forward-addr: 146.185.167.43             # SecureDNS
  forward-addr: 2a03:b0c0:0:1010::e9a:3001 # SecureDNS
```

J’ai commenté le fichier config expliquant les détails de configuration spécifiques.

Enfin, nous avons défini certaines autorisations, activer et tester l’opération sur notre résolveur DNS.

```bash
chown -R unbound:unbound /etc/unbound
systemctl enable unbound
```

#### Configurer Wireguard sur les clients

Nous pouvons maintenant enfin mettre en place notre client.

Nous commençons par installer grillage sur le client en fonction de la plate-forme sur laquelle nous sommes. Le processus d’installation est le même que celui du serveur. 

```bash
pacman -S wireguard-tools wireguard-arch
```

Si vous êtes sur Kali Linux, vous devrez peut-être installer resolvconf si vous ne l’avez pas déjà.

Nous avions déjà généré la configuration du client wg0-client. conf à l’étape 3,2. Tout ce que nous devons faire est de le déplacer vers/etc/wireguard/wg0-client.conf.

Nous avons enfin mettre en place notre interface VPN en exécutant la commande:

Manuelle 

```bash
sudo wg-quick up wg0-client 
```

Au démarrage

```bash
systemctl enable wg-quick@wg0-client
systemctl start wg-quick@wg0-client
```

Et voila, nous avons notre tunnel de Wireguard VPN en place.

```bash
wg0-client Link encap:UNSPEC  HWaddr 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00
          inet addr:192.168.2.2  P-t-P:192.168.2.2  Mask:255.255.255.255
          UP POINTOPOINT RUNNING NOARP  MTU:1420  Metric:1
          RX packets:95 errors:0 dropped:0 overruns:0 frame:0
          TX packets:177 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1
          RX bytes:14236 (14.2 KB)  TX bytes:31516 (31.5 KB)
```

La commande de WG est un grand utilitaire de Wireguard que vous pouvez employer pour afficher l’état de connexion.

```bash
sudo wg show
  
  interface: wg0-client
    public key: FwdTNMXqL46jNhZwkkzWsyR1AIlGX66vRWe1HFSemHw=
    private key: (hidden)
    listening port: 39451
    fwmark: 0xca6c

  peer: +lb7/6Nn8uhlA/6fjT3ivfM5fWKKQ2L+stX+dSq18CI=
    endpoint: 165.227.120.177:51820
    allowed ips: 0.0.0.0/0
    latest handshake: 49 seconds ago
    transfer: 11.41 MiB received, 862.25 KiB sent
    persistent keepalive: every 21 seconds
```
Vous devriez maintenant avoir une connexion VPN sécurisée en place. Vous pouvez le confirmer en vérifiant votre IP sur des sites tels que [https://whoer.net/](https://whoer.net/ "mon adresse IP est").

Assurez-vous également d’exécuter un test de fuite DNS sur [http://dnsleak.com/](http://dnsleak.com/ "DNS fuite test").

Si vous voulez vous déconnecter du VPN, vous devez mettre l’interface VPN vers le bas.

```bash
sudo wg-quick down wg0-client
```

Pour utiliser Wireguard sur les clients mobiles ([iPhone](https://iTunes.Apple.com/us/app/wireguard/id1441195209? MT = 8  "Wireguard auf dem iPhone") / [Android] (https://Play.google.com/Store/Apps/DetailsID=com.wireguard.Android&hl=fr "Wireguard auf Android ")) installer l’application, générer un code QR sur le serveur à partir de la configuration, lire le code QR avec l’application Wireguard, donner un nom et il fonctionnera quand tout est juste. 

```bash
qrencode -t ansiutf8 < wg0-client.conf
```

{{< image srcwebp="/static/img/content/2019/57.webp" srcalt="/static/img/content/2019/57.jpg" title="QRCODE zum einfachen Import in Wireguard Mobile Clients" >}}

Lisez le code QR avec l’application Wireguard et donnez un nom à la connexion. 

{{< image srcwebp="/static/img/content/2019/58.webp" srcalt="/static/img/content/2019/58.jpg" title="QRCODE einlesen und VPN Verbindung aktivieren" >}}

Maintenant, vous pouvez utiliser Wireguard sur les appareils mobiles. 

{{< image srcwebp="/static/img/content/2019/59.webp" srcalt="/static/img/content/2019/59.jpg" title="Internet mit und ohne VPN" >}}
