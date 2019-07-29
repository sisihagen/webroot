---
title: "Wireguard VPN"
date: 2019-04-28
tags: "Computer"
keywords: "WireGuard, VPN, IPv6, IPv4, Arch Linux, Arch, DNS, Virtual Private Network, Cryptography, Encryption"
shorttext: "OpenVPN was yesterday, Wireguard is the new, modern, simple and fast solution of the 21st century"
cover: "computer"
draft: false
lang: en
---

I recently discovered the awesome [Wireguard](https://www.wireguard.com/ "Fast, Modern, Secure VPN Tunnel") VPN tunnel and I was impressed. Wireguard is a simple, kernel-based, state-of-the-art VPN that also happens to be ridiculously fast and uses modern cryptographic principles that all other highspeed VPN solutions lack.

[Openvpn](https://openvpn.net/ "VPN Software Solutions &amp; Services For Business | OpenVPN") used to be my VPN solution of choice but after a few weeks with Wireguard, things changed. See the performance comparision charts done by the Wireguard author, [Jason Donenfeld](https://www.zx2c4.com/ "Jason Donenfeld"). 

{{< image srcwebp="/static/img/content/2019/55.webp" srcalt="/static/img/content/2019/55.jpg" title="Wireguard Performance" >}}

Here are just a few of the reasons why Wireguard blows away the competition:

  - It aims to be as easy to configure and deploy as SSH.
  - It is capable of roaming between IP addresses (especially useful to prevent dropped connections when you have flaky internet).
  - Uses state-of-the-art cryptography.
  - It is meant to be easily implemented in very few lines of code, and easily auditable for security vulnerabilities.
  - A combination of extremely high speed cryptographic primitives and the fact that WireGuard lives inside the Linux kernel means that secure networking can be very high-speed.
  - Stealth - does not respond to any unauthenticated packets and both peers become silent when there’s no data to be exchanged.

Hopefully you too have been sold so let’s get into the set up process.

{{< image srcwebp="/static/img/content/2019/56.webp" srcalt="/static/img/content/2019/56.jpg" title="Typical VPN Networking" >}}

  - [Arch Linux](https://www.archlinux.org/ "A simple, lightweight distribution") as Wireguard VPN Server
  - The internet facing interface on the server is eth0.
  - Arch Linux as Notebook Client
  - Server IP 192.168.2.1
  - Notebook IP 192.168.2.2
  - [Unbound](https://nlnetlabs.nl/projects/unbound/about/ "Unbound is a validating, recursive, caching DNS resolver") DNS resolver for added security.

#### Installation

  1. Install WireGuard on the VPN server.
  2. Generate server and client keys.
  3. Generate server and client configs.
  4. Enable WireGuard interface on the server.
  5. Enable IP forwarding on the server.
  6. Configure firewall rules on the server.
  7. Configure DNS.
  8. Set up Wireguard on clients.



#### Instal Wireguard on the Server

```bash
pacman -S wireguard-tools wireguard-arch
```

#### Generate the keys

```bash
cd /etc/wireguard
umask 077
wg genkey | tee server_private_key | wg pubkey > server_public_key
wg genkey | tee client_private_key | wg pubkey > client_public_key
```

#### Generate server config

Create /etc/wireguard/wg0.conf and fill it up with the follow content!

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

wg0.conf will result in an interface named wg0 therefore you can rename the file if you fancy something different.

AllowedIPs = 192.168.2.2/32 provides enhanced security by ensuring that only that a client with the IP 10.200.200.2 and the correct private key will be allowed to authenticate on the VPN tunnel .

ListenPort is the udp port to listen on. A different one can be used.

#### Generate the Client config

Create /etc/wireguard/wg0-client.conf and fill it up with the follow content.

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

Similar to the server case, wg0-client.conf will result in an interface named wg0-client so you can rename the file if you fancy something different.

AllowedIPs = 0.0.0.0/0 will allow and route all traffic on the client through the VPN tunnel. This can be narrowed down if you only want some traffic to go over VPN.

DNS = 192.168.2.1 will set the DNS resolver IP to our VPN server. This is important to prevent DNS leaks when on the VPN.

#### Enable the WireGuard interface on the server.

We will bring up the Wireguard interface on the VPN server as follows:

```bash
chown -v root:root /etc/wireguard/wg0.conf
chmod -v 600 /etc/wireguard/wg0.conf
wg-quick up wg0
systemctl enable wg-quick@wg0.service #Enable the interface at boot 
```

After this confirm you have a new interface named wg0 by running ifconfig.

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

Then also do the following to stop having to reboot the server

```bash
sysctl -p
echo 1 > /proc/sys/net/ipv4/ip_forward
```

#### Firewall

We will need to set up a few [firewall](https://netfilter.org/ "firewalling, NAT and packat managing for Linux") rules to manage our VPN and DNS traffic.

  - Track VPN connection
  - Allowing incoming VPN traffic on the listening port
  - Allow both TCP and UDP recursive DNS traffic
  - Allow forwarding of packets that stay in the VPN tunnel
  - Set up nat

```bash
iptables -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
iptables -A INPUT -p udp -m udp --dport 51820 -m conntrack --ctstate NEW -j ACCEPT
iptables -A INPUT -s 192.168.2.0/24 -p tcp -m tcp --dport 53 -m conntrack --ctstate NEW -j ACCEPT
iptables -A INPUT -s 192.168.2.0/24 -p udp -m udp --dport 53 -m conntrack --ctstate NEW -j ACCEPT
iptables -A FORWARD -i wg0 -o wg0 -m conntrack --ctstate NEW -j ACCEPT
iptables -t nat -A POSTROUTING -s 10.200.200.0/24 -o eth0 -j MASQUERADE
```

We also want to ensure that the rules remain persistent across reboots.

```bash
iptables-save > /etc/iptables/iptables.rules
systemctl enable iptables.service
```

#### Configure DNS

A major issue with a lot of VPN set ups is that the DNS is not done well enough. This ends up leaking client connection and location details. A good way to test this is through the great [http://dnsleak.com/](http://dnsleak.com/ "DNS Leak Test") site.

We are therefore going to ensure that our DNS traffic is secure. After some research I came to the conclusion that the unbound DNS solution is a very good option to use. Some of its merits include:

  - Lightweight and fast
  - Easy to install and configure
  - Security oriented
  - Supports DNSSEC

We’ll set it up in a way to counter DNS leakage, more sophisticated attacks like fake proxy configuration, rogue routers and all sorts of MITM attacks on HTTPS and other protocols.

We first do the installation on the server

```bash
pacman -S unbound
```

We then download the list of Root DNS Servers

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

I have commented the config file explaining the specific configuration details.

Finally we set some permissions, enable and test the operation on our DNS resolver.

```bash
chown -R unbound:unbound /etc/unbound
systemctl enable unbound
```

#### Set up Wireguard on clients

We can now finally set up our client.

We begin by installing wireguard on the client depending on what platform we’re on. The installation process is the same as the server’s. 

```bash
pacman -S wireguard-tools wireguard-arch
```

If you are on Kali Linux, you may have to install resolvconf if you don’t have it already.

We had already generated the wg0-client.conf client config in step 3.2. All we need to do is to move it to /etc/wireguard/wg0-client.conf.

We finally bring up our VPN interface by running the command:

Manual 

```bash
sudo wg-quick up wg0-client 
```

On Boot
```bash
systemctl enable wg-quick@wg0-client
systemctl start wg-quick@wg0-client
```

And voila, we have our Wireguard VPN tunnel in place.

```bash
wg0-client Link encap:UNSPEC  HWaddr 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00
          inet addr:192.168.2.2  P-t-P:192.168.2.2  Mask:255.255.255.255
          UP POINTOPOINT RUNNING NOARP  MTU:1420  Metric:1
          RX packets:95 errors:0 dropped:0 overruns:0 frame:0
          TX packets:177 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1
          RX bytes:14236 (14.2 KB)  TX bytes:31516 (31.5 KB)
```

The wg command is a great Wireguard utility that you can use to view connection status.

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
You should now have a secure VPN connection in place. You can confirm this by checking your IP on sites such as [https://whoer.net/](https://whoer.net/ "My IP Address is ... ").

Ensure you also run a DNS leak test on [http://dnsleak.com/](http://dnsleak.com/ "DNS Leak Test").

If you want to disconnect from the VPN you have to bring the VPN interface down.

```bash
sudo wg-quick down wg0-client
```

To use Wireguard on mobile Clients ([Iphone](https://itunes.apple.com/us/app/wireguard/id1441195209?mt=8 "Wireguard auf dem Iphone") / [Android](https://play.google.com/store/apps/details?id=com.wireguard.android&hl=en "Wireguard auf Android")) install the app, generate a QR Code on the Server out from the config, read the QR Code with Wireguard App, give a name and it will work when all is right. 

```bash
qrencode -t ansiutf8 < wg0-client.conf
```

{{< image srcwebp="/static/img/content/2019/57.webp" srcalt="/static/img/content/2019/57.jpg" title="QRCODE zum einfachen Import in Wireguard Mobile Clients" >}}

Read the QR Code with the Wireguard App and give a name for the connection. 

{{< image srcwebp="/static/img/content/2019/58.webp" srcalt="/static/img/content/2019/58.jpg" title="QRCODE einlesen und VPN Verbindung aktivieren" >}}

Now you can use Wireguard on mobile devices. 

{{< image srcwebp="/static/img/content/2019/59.webp" srcalt="/static/img/content/2019/59.jpg" title="Internet mit und ohne VPN" >}}
