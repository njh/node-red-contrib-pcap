/**
 * Copyright 2016 Nicholas Humfrey
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    "use strict";
    var os = require('os');
    var pcap = require('pcap');

    function PacketCapture(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        node.ifname = n.ifname;
        node.filter = n.filter || null;
        node.decode = n.decode;
        
        if (node.ifname) {
            node.session = pcap.createSession(node.ifname, node.filter);
            node.session.on('packet', function (raw_packet) {
                var msg = {};
                if (node.decode) {
                    msg.payload = pcap.decode.packet(raw_packet);
                } else {
                    msg.payload = raw_packet;
                }
                msg.topic = node.ifname;
                node.send(msg);
            });
        }

        node.on("close", function() {
            try {
                node.session.close();
            } catch (err) {
                node.error(err);
            }
        });
    }
    RED.nodes.registerType("pcap", PacketCapture);

    RED.httpAdmin.get("/pcap/interfaces", function(req, res) {
        var result = {};
        var interfaces = os.networkInterfaces();
        Object.keys(interfaces).forEach(function(ifname) {
            var mac = 'unknown';
            for(var address of interfaces[ifname]) {
                if (address['mac'] && address['mac'] != '00:00:00:00:00:00') {
                    mac = address.mac;
                    break;
                } else if (address['internal'] == true) {
                    mac = "Internal";
                }
            }
            result[ifname] = ifname + ' ('+mac+')';
        });

        res.send({
            'interfaces': result
        });
    });
};
