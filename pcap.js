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
        node.output = n.output;
        node.filter = n.filter || null;
        node.path = n.path;
        
        if (node.ifname) {
            node.session = pcap.createSession(node.ifname, {filter: node.filter});
            node.session.on('packet', function (raw_packet) {
                var msg = {};
                if (node.output == "raw") {
                    msg.payload = raw_packet;
                } else {
                    var decoded = pcap.decode.packet(raw_packet);
                    
                    if (node.path) {
                        var pathParts = node.path.split(".");
                        pathParts.reduce(function(obj, i) {
                            decoded = (typeof obj[i] !== "undefined" ? obj[i] : undefined);
                            return decoded;
                        }, decoded);
                    }

                    if (node.output == "object") {
                        msg.payload = decoded;
                    } else if (node.output == "string") {
                        msg.payload = String(decoded)
                    }
                }
                msg.topic = node.ifname;
                node.send(msg);
            });
        }

        node.on("close", function() {
            try {
                node.session.close();
            } catch (err) {
                node.error("errpr", err);
            }
        });
    }
    RED.nodes.registerType("pcap", PacketCapture);

    RED.httpAdmin.get("/pcap/interfaces", function(req, res) {
        var result = {};
        var interfaces = os.networkInterfaces();
        Object.keys(interfaces).forEach(function(ifname) {
            var mac = 'unknown';
            for(var key in interfaces[ifname]) {
                var address = interfaces[ifname][key];
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
