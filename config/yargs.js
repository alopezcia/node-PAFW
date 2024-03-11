const { denials } = require('../pafw/denials');
const { status } = require('../pafw/status');
const { vpnUsers } = require('../pafw/vpn');
 
const { test } = require('../util/leer-csv');


const opts = {
    ip: {
        demand: true,
        alias: 'i',
        help: 'Panoramo IP or name'
    },
    username: {
        alias: 'u',
        help: 'Panoramo Admin Username '
    },
    password: {
        alias: 'p',
        help: 'Panoramo Admin Password'
    },
    key: {
        alias: 'k',
        help: 'ApiKey named X-PAN-KEY'
    }        
};


const doSwitch = ( cmd, ip, key ) => {
//    setEnvValue('X_PAN_KEY', key );

    switch( cmd ){
        case 'denials':
            denials(ip, key);
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
        default:
            console.log('Comando no reconocido');
    }
};


const argv = require('yargs')
    .command('denials', 'Compare PA-FW denials with public cidr lists Azure IoT Hub', opts )
    .command('status', 'Request a status command from the FW', opts )
    .command('test', 'Test with dowaloaded CSV from PA', {} )
    .command('vpnusers', 'Show VPN Users', opts )
    .help()
    .argv;

module.exports = {
    argv,
    doSwitch
}