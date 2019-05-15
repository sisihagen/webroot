---
title: "Wireguard VPN"
date: 2019-04-28
tags: "Компьютер"
keywords: "WireGuard, подключение VPN с IPv6, с IPv4, Арч Линукс, арки, DNS-серверы, виртуальные частные сети, криптография, шифрование"
shorttext: "OpenVPN был вчера, Wireguard-это новое, современное, простое и быстрое решение 21-го века"
cover: "computer"
draft: false
lang: ru
---

Недавно я обнаружил удивительный [Wireguard](https://www.wireguard.com/ "быстрый, современный, безопасный VPN-туннель") VPN-туннель, и я был впечатлен. Wireguard-это простой, основанный на ядре, современный VPN, который также смехотворно быстр и использует современные криптографические принципы, которых не хватает всем другим высокоскоростным VPN-решениям.

[Подключиться](https://openvpn.net/ "программное обеспечение VPN-решений и усилителя; услуги для бизнеса | для OpenVPN") используется для быть моя VPN-решение выбора, но через несколько недель с Wireguard, все изменилось. См. диаграммы сравнения производительности, сделанные автором Wireguard, [Jason Donenfeld](https://www.zx2c4.com/ "Jason Donenfeld").

{{< image srcwebp="/static/img/content/2019/55.webp" srcalt="/static/img/content/2019/55.jpg" title="Wireguard Performance" >}}

Вот лишь некоторые из причин, почему Wireguard сдувает конкуренцию:

  - Он стремится быть таким же простым в настройке и развертывании, как SSH.
  - Он способен к роумингу между IP-адресами (особенно полезно, чтобы предотвратить падение соединения, когда у вас есть чешуйчатый интернет).
  - Использует государство-оф-искусство тайнописи.
  - Он должен быть легко реализован в очень немногих строках кода и легко прослушивается для уязвимостей безопасности.
  - Комбинация чрезвычайно высокоскоростных криптографических примитивов и тот факт, что WireGuard живет внутри ядра Linux, означает, что безопасная сеть может быть очень высокоскоростной.
  - Стелс Вы тоже были проданы, так что давайте перейдем к процессу настройки.

Надеюсь, вы тоже были проданы, поэтому давайте перейдем к процессу настройки.

{{< image srcwebp="/static/img/content/2019/56.webp" srcalt="/static/img/content/2019/56.jpg" title="Typical VPN Networking" >}}

  - [Arch Linux](https://www.archlinux.org/ "простой, легкий дистрибутив") в качестве VPN-сервера Wireguard
  - Интернет-интерфейс на сервере-eth0.
  - Arch Linux как клиент ноутбука
  - IP сервера 192.168.2.1
  - Ноутбук с IP 192.168.2.2
  - [Несвой](https://nlnetlabs.nl/projects/unbound/about/ "Свободный-это форумчанин, рекурсивные, кэш распознавателя DNS") сопоставителя DNS для дополнительной безопасности.

#### Установка

  1. Установите WireGuard на VPN-сервере.
  2. Создание ключей сервера и клиента.
  3. Создание конфигурации сервера и клиента.
  4. Включите интерфейс WireGuard на сервере.
  5. Включите перенаправление IP-адресов на сервере.
  6. Настроить правила брандмауэра на сервере.
  7. Настроить DNS.
  8. Настройте Wireguard на клиентах.



#### Установить Wireguard на сервере

```bash
pacman -S wireguard-tools wireguard-arch
```

#### Сгенерировать ключи

```bash
cd /etc/wireguard
umask 077
wg genkey | tee server_private_key | wg pubkey > server_public_key
wg genkey | tee client_private_key | wg pubkey > client_public_key
```

#### Создать конфигурацию сервера

Создать /etc/wireguard / wg0.conf и заполните его следующим контентом!

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

wg0.conf приведет к интерфейсу с именем wg0, поэтому вы можете переименовать файл, если вам нравится что-то другое.

AllowedIPs = 192.168.2.2/32 обеспечивает повышенную безопасность, гарантируя, что только клиенту с IP 10.200.200.2 и правильным закрытым ключом будет разрешено аутентифицироваться на VPN-туннеле .

ListenPort-это udp-порт для прослушивания. Можно использовать другой.

#### Generate the Client config

Создать /etc/wireguard/wg0-client.conf и заполните его следующим контентом.

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

Аналогично случаю сервера, wg0-client.conf приведет к интерфейсу с именем wg0-client, поэтому вы можете переименовать файл, если хотите что-то другое.

AllowedIPs = 0.0.0.0/0 позволит и маршрутизировать весь трафик на клиенте через VPN-туннель. Это можно сузить, если вы хотите, чтобы какой-то трафик проходил через VPN.

DNS = 192.168.2.1 установит IP-адрес DNS-преобразователя на наш VPN-сервер. Это важно для предотвращения утечки DNS, когда на VPN.

#### Включите интерфейс WireGuard на сервере.

Мы будем воспитывать интерфейс Wireguard на VPN-сервере выглядит следующим образом:

```bash
chown -v root:root /etc/wireguard/wg0.conf
chmod -v 600 /etc/wireguard/wg0.conf
wg-quick up wg0
systemctl enable wg-quick@wg0.service #Enable the interface at boot 
```

После этого подтвердите, что у вас есть новый интерфейс с именем wg0, запустив ifconfig.

```language
wg0: flags=209<UP,POINTOPOINT,RUNNING,NOARP>  mtu 1420
        inet 192.168.2.1  netmask 255.255.255.255  destination 192.168.2.1
        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 1000  (UNSPEC)
        RX packets 942096  bytes 266132696 (253.8 MiB)
        RX errors 189  dropped 16  overruns 0  frame 189
        TX packets 1662808  bytes 1986213236 (1.8 GiB)
        TX errors 0  dropped 895 overruns 0  carrier 0  collisions 0
```

#### IP-пересылки

```bash
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
```

Затем также выполните следующие действия, чтобы остановить того, чтобы перезагрузить сервер

```bash
sysctl -p
echo 1 > /proc/sys/net/ipv4/ip_forward
```

#### Брандмауэр

Нам нужно будет настроить несколько [брандмауэров](https://netfilter.org/ "firewalling, NAT и packat управление для Linux") правила для управления нашим VPN и DNS-трафиком.

  - Отслеживать VPN-соединение
  - Разрешение входящего трафика VPN на прослушивающем порту
  - Разрешить как TCP, так и UDP рекурсивный DNS-трафик
  - Разрешить пересылку пакетов в VPN-туннель
  - Настройка nat

```bash
iptables -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
iptables -A INPUT -p udp -m udp --dport 51820 -m conntrack --ctstate NEW -j ACCEPT
iptables -A INPUT -s 192.168.2.0/24 -p tcp -m tcp --dport 53 -m conntrack --ctstate NEW -j ACCEPT
iptables -A INPUT -s 192.168.2.0/24 -p udp -m udp --dport 53 -m conntrack --ctstate NEW -j ACCEPT
iptables -A FORWARD -i wg0 -o wg0 -m conntrack --ctstate NEW -j ACCEPT
iptables -t nat -A POSTROUTING -s 10.200.200.0/24 -o eth0 -j MASQUERADE
```

Мы также хотим, чтобы правила оставались постоянными при перезагрузке.

```bash
iptables-save > /etc/iptables/iptables.rules
systemctl enable iptables.service
```

#### Настройка DNS

Основная проблема с большим количеством VPN-настроек заключается в том, что DNS не выполняется достаточно хорошо. Это приводит к утечке клиентского соединения и сведений о местоположении. Хороший способ проверить это - через великого [http://dnsleak.com/](http://dnsleak.com/ "тест утечки DNS") сайт.

Поэтому мы собираемся обеспечить безопасность нашего DNS-трафика. После некоторых исследований я пришел к выводу, что несвязанное решение DNS является очень хорошим вариантом для использования. Некоторые из его достоинств включают:

  - Легкий и быстрый
  - Простота установки и настройки
   Ориентированных на безопасность 
  - Поддержка DNSSEC

Мы настроим его таким образом, чтобы противостоять утечке DNS, более сложным атакам, таким как поддельная конфигурация прокси, маршрутизаторы-изгои и всевозможные атаки MITM на HTTPS и другие протоколы.

Сначала делаем установку на сервере

```bash
pacman -S unbound
```

Затем мы загружаем список корневых DNS-серверов

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

Я прокомментировал файл конфигурации, объясняя конкретные детали конфигурации.

Наконец, мы устанавливаем некоторые разрешения, включаем и тестируем операцию на нашем DNS-распознавателе.

```bash
chown -R unbound:unbound /etc/unbound
systemctl enable unbound
```

#### Настройка Wireguard на клиентах

Теперь мы можем, наконец, настроить нашего клиента.

Мы начинаем с установки wireguard на клиенте в зависимости от того, на какой платформе мы находимся. Процесс установки совпадает с процессом установки сервера.

```bash
pacman -S wireguard-tools wireguard-arch
```

Если вы находитесь на Kali Linux, вам может потребоваться установить resolvconf, если у вас его еще нет.

Мы уже сгенерировали wg0-клиент.конфигурация клиента conf в шаге 3.2. Все, что нам нужно сделать, это переместить его в /etc/wireguard/wg0-client.conf.

Мы, наконец, поднять наш интерфейс VPN, выполнив команду:

Руководство 

```bash
sudo wg-quick up wg0-client 
```

при загрузке системы

```bash
systemctl enable wg-quick@wg0-client
systemctl start wg-quick@wg0-client
```

И вуаля, у нас есть наш VPN-туннель Wireguard.

```bash
wg0-client Link encap:UNSPEC  HWaddr 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00
          inet addr:192.168.2.2  P-t-P:192.168.2.2  Mask:255.255.255.255
          UP POINTOPOINT RUNNING NOARP  MTU:1420  Metric:1
          RX packets:95 errors:0 dropped:0 overruns:0 frame:0
          TX packets:177 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1
          RX bytes:14236 (14.2 KB)  TX bytes:31516 (31.5 KB)
```

Команда wg-отличная утилита Wireguard, которую можно использовать для просмотра состояния соединения.

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

Теперь у вас должно быть безопасное VPN-соединение. Вы можете подтвердить это, проверив свой IP-адрес на таких сайтах, как [https://whoer.net/](https://whoer.net/ "мой IP-адрес").

Убедитесь, что вы также запустите тест утечки DNS на [http://dnsleak.com/](http://dnsleak.com / "тест утечки DNS").

Если вы хотите отключиться от VPN, вы должны привести интерфейс VPN вниз.

```bash
sudo wg-quick down wg0-client
```

Использование Wireguard на мобильных клиентах ([Iphone](https://itunes.apple.com/us/app/wireguard/id1441195209?mt=8 "Wireguard auf dem Iphone") / [Android](https://play.google.com/store/apps/details?id=com.wireguard.android&hl=en "Wireguard auf Android")) установите приложение, сгенерируйте QR-код на сервере из конфигурации, прочитайте QR-код с приложением Wireguard, дайте имя, и он будет работать, когда все в порядке.

```bash
qrencode -t ansiutf8 < wg0-client.conf
```

{{< image srcwebp="/static/img/content/2019/57.webp" srcalt="/static/img/content/2019/57.jpg" title="QRCODE zum einfachen Import in Wireguard Mobile Clients" >}}

Прочитайте QR-код с приложением Wireguard и дайте имя для подключения.

{{< image srcwebp="/static/img/content/2019/58.webp" srcalt="/static/img/content/2019/58.jpg" title="QRCODE einlesen und VPN Verbindung aktivieren" >}}

Теперь вы можете использовать Wireguard на мобильных устройствах.

{{< image srcwebp="/static/img/content/2019/59.webp" srcalt="/static/img/content/2019/59.jpg" title="Internet mit und ohne VPN" >}}
