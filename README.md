# node-red-contrib-pcap

The *node-red-contrib-pcap* adds support to [Node-RED] for capture and decoding network packets using [libpcap].

![screenshot](https://github.com/njh/node-red-contrib-pcap/raw/master/screenshot.png)


## Installation

You need to have [libpcap] installed on your system before you can install this module.

On Debian and Ubuntu:

    apt-get install libpcap-dev

On MacOS X, using [Homebrew]:

    brew install libpcap

The change to your node-red installation directory and then run:

    npm install node-red-contrib-pcap

You will then be able to see the new _pcap_ node type added to Node-RED's pallet on the left, in the advanced section.


Copyright and license
---------------------

Copyright 2016 Nicholas Humfrey under [the Apache 2.0 license](LICENSE).


[Node-RED]:  http://nodered.org/
[Homebrew]:  http://brew.sh/
[libpcap]:   http://www.tcpdump.org/
