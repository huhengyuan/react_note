{
    WLAN: [
        {
            address: 'fe80::71b8:803:b0d0:f0c7',
            netmask: 'ffff:ffff:ffff:ffff::',
            family: 'IPv6',
            mac: 'fc:77:74:b8:73:6a',
            internal: false,
            cidr: 'fe80::71b8:803:b0d0:f0c7/64',
            scopeid: 4
        },
        {
            address: '192.168.50.236',
            netmask: '255.255.255.0',
            family: 'IPv4',
            mac: 'fc:77:74:b8:73:6a',
            internal: false,
            cidr: '192.168.50.236/24'
        }
    ],
        'VMware Network Adapter VMnet1': [
            {
                address: 'fe80::f2cf:e2ac:7987:96f9',
                netmask: 'ffff:ffff:ffff:ffff::',
                family: 'IPv6',
                mac: '00:50:56:c0:00:01',
                internal: false,
                cidr: 'fe80::f2cf:e2ac:7987:96f9/64',
                scopeid: 7
            },
            {
                address: '192.168.140.1',
                netmask: '255.255.255.0',
                family: 'IPv4',
                mac: '00:50:56:c0:00:01',
                internal: false,
                cidr: '192.168.140.1/24'
            }
        ],
            'VMware Network Adapter VMnet8': [
                {
                    address: 'fe80::3ab:a90a:94b2:2a9a',
                    netmask: 'ffff:ffff:ffff:ffff::',
                    family: 'IPv6',
                    mac: '00:50:56:c0:00:08',
                    internal: false,
                    cidr: 'fe80::3ab:a90a:94b2:2a9a/64',
                    scopeid: 10
                },
                {
                    address: '192.168.200.1',
                    netmask: '255.255.255.0',
                    family: 'IPv4',
                    mac: '00:50:56:c0:00:08',
                    internal: false,
                    cidr: '192.168.200.1/24'
                }
            ],
                'Loopback Pseudo-Interface 1': [
                    {
                        address: '::1',
                        family: 'IPv6',
                        mac: '00:00:00:00:00:00',
                        internal: true,
                        cidr: '::1/128',
                        scopeid: 0
                    },
                    {
                        address: '127.0.0.1',
                        netmask: '255.0.0.0',
                        family: 'IPv4',
                        mac: '00:00:00:00:00:00',
                        internal: true,
                        cidr: '127.0.0.1/8'
                    }
                ]
}