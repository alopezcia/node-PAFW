const { azured } = require('../pafw/azured');
const { denials } = require('../pafw/denials');
const { status } = require('../pafw/status');
const { vpnUsers } = require('../pafw/vpn');
const { traffic } = require('../pafw/traffic') ;
const { test } = require('../util/leer-csv');


const opts = {
    ip: {
        demand: true,
        alias: 'i',
        describe: 'Panoramo IP or name'
    },
    username: {
        alias: 'u',
        describe: 'Panoramo Admin Username '
    },
    password: {
        alias: 'p',
        describe: 'Panoramo Admin Password'
    },
    key: {
        alias: 'k',
        describe: 'ApiKey named X-PAN-KEY'
    }        
};

const optsDeny = {
    deny:{ 
        demand: true,
         alias: 'd', 
         describe: 'IP deny' 
    },
    period: {
        demand: true,
        alias: 't',
        choice: [1, 7, 14, 30, 180, 360 ],
        describe: 'Capture Period '
    }
}

const doSwitch = async ( cmd, ip, key, filter ='', deny='', period=1 ) => {
//    setEnvValue('X_PAN_KEY', key );

    switch( cmd ){
        case 'azured':
            azured(ip, key, deny, period);
            break;
        case 'denials':
            denials(ip, key, deny, period);
            break;
        case 'status':
            status(ip, key);
            break;
        case 'test':
            test();
            break;
        case 'vpnusers':
            vpnUsers(ip, key);
            break;
        case 'traffic':
            const trf = await traffic(ip, key, filter);
            console.log( trf );
            break;
        default:
            console.log('Comando no reconocido');
    }
};


const argv = require('yargs')
    .command('azured', 'Compare PA-FW denials with public cidr lists Azure IoT Hub', { ...opts, ...optsDeny } )
    .command('denials', 'Compare PA-FW denials with public cidr lists Azure IoT Hub', { ...opts, ...optsDeny } )
    .command('status', 'Request a status command from the FW', opts )
    .command('test', 'Test with dowaloaded CSV from PA', {} )
    .command('vpnusers', 'Show VPN Users', opts )
    .command('traffic', 'Show VPN Users', { ...opts, filter:{ alias: 'f', describe: 'Filter' }} )
    .help()
    .argv;

module.exports = {
    argv,
    doSwitch
}