node-red-contrib-pcap
=====================

The *node-red-contrib-pcap* adds support to [Node-RED] for capture and decoding network packets using [libpcap].

![screenshot](https://github.com/njh/node-red-contrib-pcap/raw/master/screenshot.png)


Installation
------------

You need to have [libpcap] installed on your system before you can install this module.

On Debian and Ubuntu:

    apt-get install libpcap-dev

On MacOS X, using [Homebrew]:

    brew install libpcap

Then change to your node-red installation directory and then run:

    npm install node-red-contrib-pcap

You will then be able to see the new _pcap_ node type added to Node-RED's pallet on the left, in the _network_ category.


Configuration
-------------

A single *Interface* can be chosen for each node instance.
The list shows the network interfaces and MAC address of the 
interfaces on the Node-RED host system.

There are three different *Output* options:

* Raw Network packet - outputs a Buffer object containing the binary packet.
* Decoded pcap objects - the [pcap npm package] contains a set of packet decoder objects.
* String - converts the decoded packet objects to string representation. Use the *path* setting below to choose specific fields.

The *Filter* setting can be used to filter the network packets received
before they get to Node-RED. The syntax is the same as tcpdump/libpcap/wireshark.
See the [pcap-filter(7)] man page for details of this syntax.

The *Path* setting is only used for the String/Decoded packet outputs. It allows you 
you choose a sub-property of packet, rather than outputting the whole packet.
The structure is based on the [decode objects] within the pcap package. This can be slightly tricky to work out, the documentation
recommends exploring the structure using ```sys.inspect``` - in Node-RED this can be 
done using the _debug_ node.
Call ```.payload``` repeatedly to get to higher level protocol headers.
    
#### Path Examples

* ```pcap_header.tv_sec``` the time the packet was recieved
* ```payload.shost``` the Layer 2 MAC address of the source of the packet
* ```payload.dhost``` the Layer 2 MAC address of the destination of the packet
* ```payload.ethertype``` the Layer 2 Ethernet packet type identifier
* ```payload.payload.saddr``` the source IP address of the packet
* ```payload.payload.daddr``` the destination IP address of the packet

_If you have any other configuration tips for other users, please submit a Pull Request for this README._


Capturing ARP packets
---------------------

I originally wrote this Node-RED node in order to receive notifications when I press my 
[Amazon Dash] wifi button. These buttons, intended for ordering things from Amazon, 
send out ARP and DHCP packets to the whole network when they are pressed.

These are the settings I use on my Raspberry Pi to detect devices appearing on the network:

* Interface: ```eth0```
* Output: ```String```
* Filter: ```arp```
* Path: ```payload.shost```
* Name: ```Capture ARP on eth0```

These are the same as the screenshot shown above.


Copyright and license
---------------------

Copyright 2016 Nicholas Humfrey under [the Apache 2.0 license](LICENSE).


[Node-RED]:         http://nodered.org/
[Homebrew]:         http://brew.sh/
[libpcap]:          http://www.tcpdump.org/
[decode objects]:   http://github.com/mranney/node_pcap/tree/master/decode
[pcap-filter(7)]:   http://www.tcpdump.org/manpages/pcap-filter.7.html
[pcap npm package]: https://www.npmjs.com/package/pcap
[Amazon Dash]:      http://www.amazon.com/oc/dash-button

