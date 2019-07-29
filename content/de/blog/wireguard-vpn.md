---
title: "Wireguard VPN"
date: 2019-04-28
tags: "Computer"
keywords: "WireGuard, VPN, IPv6, IPv4, Arch Linux, Arch, Nameauflösung, DNS, Virtual Private Network, Kryptographie, Verschlüsselung"
shorttext: "OpenVPN war gestern, Wireguard ist die neue, moderne, einfache und schnelle Lösung des 21. Jahrhundert"
cover: "computer"
draft: false
lang: de 
---

Ich nutze seit ein paar Monaten [Wireguard](https://www.wireguard.com/ "Fast, Modern, Secure VPN Tunnel") als VPN Tunnel zwischen meinen Servern und auf meinen Iphone. Die Einrichtung ist denkbar einfach und funktioniert auch mit IPv6. 

Openvpn war eine VPN-Lösung, aber nach ein paar Wochen mit Wireguard, haben sich diese Dinge geändert. Einfache Einrichtung, moderne Kryptographie, IPv6 und die Performance sprechen für sich. 

{{< image srcwebp="/static/img/content/2019/55.webp" srcalt="/static/img/content/2019/55.jpg" title="Wireguard Performance im Vergleich" >}}

Gründe warum Wireguard die richtige VPN Software ist:

  - einfache Konfiguration und so schnell wie SSH implementiert
  - Roaming zwischen IP Adressen was instabilen Verbindungen hilft
  - Modernste Kryptographie 
  - wenige Codezeilen und so leicht auf Sicherheitslücken prüfbar
  - schnelle kryptographischen Primitiven + WireGuard im Kernel = schnell
  - unauthentifizierte Pakete werden ignoriert und Ruhe wenn nichts ausgetauscht wird. 

Hoffentlich habe ich Sie schon überzeugt und wir können mit der Installation starten.

{{< image srcwebp="/static/img/content/2019/56.webp" srcalt="/static/img/content/2019/56.jpg" title="Typische VPN Verbindung" >}}

  - [Arch Linux](https://www.archlinux.org/ "A simple, lightweight distribution") als Wireguard VPN Server
  - Netzwerkschnittstelle ist eth0 
  - Arch Linux als Notebook Client
  - Server IP 192.168.2.1
  - Notebook IP 192.168.2.2
  - [Unbound](https://nlnetlabs.nl/projects/unbound/about/ "Unbound is a validating, recursive, caching DNS resolver") als DNS Resolver 

#### Installation

  1. Wireguard installieren
  2. Schlüssel generieren
  3. Konfigurationen schreiben
  4. Wireguard aktivieren
  5. IP Forwarding aktivieren
  6. Firewall Regeln schreiben
  7. Nameauflösung einrichten
  8. Installation auf den Clients


#### Wireguard installieren

```bash
pacman -S wireguard-tools wireguard-arch
```

#### Schlüssel generieren

```bash
cd /etc/wireguard
umask 077
wg genkey | tee server_private_key | wg pubkey > server_public_key
wg genkey | tee client_private_key | wg pubkey > client_public_key
```

#### Server Konfiguration

Erstelle /etc/wireguard/wg0.conf

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

wg0.conf führt zur Schnittstelle mit den Namen wg0. 

AllowedIPs = ..../32 bietet die Sicherheit das sich nur der Client mit der entsprechenden IP und den richtigen privaten Schlüssel mit den Server verbinden kann. 

ListenPort ist der udp Port auf dem Wireguard Verbindungen annimmt, der Port kann frei geändert werden. 

#### Client Konfiguration

Erstellen wir zuerst /etc/wireguard/wg0-client.conf

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

Simular zum Server wird mit wg0-client.conf die Schnittstelle angesprochen.

AllowedIps = 0.0.0.0/0, ::/0 leitet den gesamten Traffic auf dem Clienten über den VPN Tunnel.

DNS = 192.168.2.1 wird für die Namensauflösung benötigt, insbesondere auf mobilen Netzwerkclients ist es notwendig um Leaks vorzubeugen. 

#### Wireguard aktivieren

```bash
chown -v root:root /etc/wireguard/wg0.conf
chmod -v 600 /etc/wireguard/wg0.conf
wg-quick up wg0
systemctl enable wg-quick@wg0.service #Enable the interface at boot 
```

Prüfen Sie mit ifconfig ob die Schnittstelle aktiv ist. 

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

Temporär kann es auch mit nachfolgenden erreicht werden. 

```bash
sysctl -p
echo 1 > /proc/sys/net/ipv4/ip_forward
```

#### Firewall

Wir brauchen ein paar [iptables](https://netfilter.org/ "firewalling, NAT and packat managing for Linux") Regeln um unseren Traffic und DNS zu managen. 

  - VPN Traffic erlauben
  - DNS Traffic managen
  - Forwarding
  - Nat

```bash
iptables -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
iptables -A INPUT -p udp -m udp --dport 51820 -m conntrack --ctstate NEW -j ACCEPT
iptables -A INPUT -s 192.168.2.0/24 -p tcp -m tcp --dport 53 -m conntrack --ctstate NEW -j ACCEPT
iptables -A INPUT -s 192.168.2.0/24 -p udp -m udp --dport 53 -m conntrack --ctstate NEW -j ACCEPT
iptables -A FORWARD -i wg0 -o wg0 -m conntrack --ctstate NEW -j ACCEPT
iptables -t nat -A POSTROUTING -s 10.200.200.0/24 -o eth0 -j MASQUERADE
```

Iptables Regeln speichern und bei einem Neustart automatisch aktivieren.

```bash
iptables-save > /etc/iptables/iptables.rules
systemctl enable iptables.service
```

#### Nameauflösung

Ein großes Problem mit vielen VPN ist, dass das DNS nicht vernünftig umgesetzt wird. Dies führt zu DNS Leaks. Eine gute Möglichkeit es zu testen bieten [http://dnsleak.com/](http://dnsleak.com/ "DNS Leak Test").

Wir werden daher unseren DNS Traffic entsprechend sicher gestalten und hier kommt nur eine ungebundene DNS Lösung in Frage. 

  - Leicht und Schnell
  - Einfache Installation und Konfiguration
  - Sicherheitsorientiert
  - DNSSEC

Wir werden es so einrichten, dass DNS-Leaks, ausgeklügeltere Angriffe wie gefälschte Proxy-Konfiguration, Rogue router und alle Arten von MITM Angriffen auf HTTPS und andere Protokolle entgegenwirken.

```bash
pacman -S unbound
```

Root DNS Server

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

Die Kommentare erklären die Funktionen der entsprechenden Einträge. Wir setzen die entsprechenden Rechte und aktivieren unbound.

```bash
chown -R unbound:unbound /etc/unbound
systemctl enable unbound
```

#### Client

Jetzt werden wir Wireguard auf den Clienten installatieren und entsprechend konfigurieren. 

```bash
pacman -S wireguard-tools wireguard-arch
```

Die wg0-client.conf haben wir bereits erstellt. Sie müssen diese nur auf den Client übertragen, oder mit Copy / Paste schreiben. 

Wireguard kann von Hand, oder automatisch aktiviert werden. 

Manuell starten und schließen

```bash
sudo wg-quick up wg0-client 
sudo wg-quick down wg0-client 
```

Beim Boot Prozess aktivieren

```bash
systemctl enable wg-quick@wg0-client
```

Sie können über [https://whoer.net/](https://whoer.net/ "Wie ist meine IP") testen ob die Verbindung erfolgreich ist und testen Sie auf DNS Leaks über [http://dnsleak.com/](http://dnsleak.com/ "DNS Leak Test").

Für mobile Clients wie [Iphone](https://itunes.apple.com/us/app/wireguard/id1441195209?mt=8 "Wireguard auf dem Iphone") / [Android](https://play.google.com/store/apps/details?id=com.wireguard.android&hl=en "Wireguard auf Android") installieren Sie die App, erstellen Sie ein QRCode und lesen Sie damit die Konfiguration in den mobilen Client. 

```bash
qrencode -t ansiutf8 < wg0-client.conf
```

{{< image srcwebp="/static/img/content/2019/57.webp" srcalt="/static/img/content/2019/57.jpg" title="QRCODE zum einfachen Import in Wireguard Mobile Clients" >}}

Diesen QRCode lesen Sie in der Wireguard App ein, vergeben ein Namen und können dann die VPN Konfiguartion aktivieren. 

{{< image srcwebp="/static/img/content/2019/58.webp" srcalt="/static/img/content/2019/58.jpg" title="QRCODE einlesen und VPN Verbindung aktivieren" >}}

Danach sollte bei richtiger Konfiguration alles laufen. 

{{< image srcwebp="/static/img/content/2019/59.webp" srcalt="/static/img/content/2019/59.jpg" title="Internet mit und ohne VPN" >}}
