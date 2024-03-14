const { argv, doSwitch } = require('./config/yargs');
const { checkApiKey, getToken } = require('./pafw/login');
const { setEnvValue } = require('./util/writeenv');
const { test } = require('./util/leer-csv');

require('dotenv').config();


// 1º Obtener parámetros
const fwIP = argv.ip;
const cmd = argv._[0];
if( cmd === 'test'){
    test();
    return;
} 
// Ñapa para no procesar si no es un comando registrado
else 
    if( ! ['azured', 'denials', 'status', 'vpnusers', 'traffic', 'traffic' ].includes(cmd) ){
        console.log('Comando no reconocido');
        return;
    }

let fwUsername = process.env.USERNAME;
if( argv.username ){
    fwUsername = argv.username;
}
if( fwUsername === 'undefined' ){
    fwUsername = undefined;
}

let fwPassword = process.env.PASSWORD;
if( argv.password ){
    fwPassword = argv.password;
}
if( fwPassword === 'undefined' ){
    fwPassword = undefined;
}

let fwXPanKey = process.env.X_PAN_KEY;
if( argv.key ){
    fwXPanKey = argv.key;
}
if( fwXPanKey === 'undefined' ){
    fwXPanKey = undefined;
}
const filter = argv.filter;
const deny = argv.deny;
const period = argv.period;

// 2º Controlar existencia de crendeciales o de token
// Preferencia existencia de token
// validar token
if( fwXPanKey  && fwXPanKey.length > 0   ){
    const c = checkApiKey( fwIP, fwXPanKey );
    c.then( checked => {
        if( checked ){
            doSwitch( cmd, fwIP, fwXPanKey, filter, deny, period );
            setEnvValue('X_PAN_KEY', fwXPanKey );
            apikeyValido=true;
        } else {
            console.log( 'Key api no válida')
            setEnvValue('X_PAN_KEY', '' );
            if( !fwUsername || !fwPassword ){
                console.error('Faltan credenciales')
                return;
            }
            const t = getToken( fwIP, fwUsername, fwPassword );
            t.then( token => { 
                doSwitch( cmd, fwIP, token, filter, deny, period ); 
                setEnvValue('X_PAN_KEY', token );
            }).catch( err => console.log(err));
        }
        return;
    })
    .catch( err => console.log(err));
} else {
    // 3º o no hay token en las parámetro, o ya no es válido
    // Validar credenciales
    if( !fwUsername || !fwPassword ){
        console.error('Faltan credenciales')
        return;
    }
    const t = getToken( fwIP, fwUsername, fwPassword );
    t.then( token => {
        doSwitch( cmd, fwIP, token );
        setEnvValue('X_PAN_KEY', token );
    }).catch( err => console.log(err));
}

// console.log(`Command: ${cmd}, PanoramoIP: ${fwIP}, Username: ${fwUsername}, Password: ${fwPassword} X-PAN-KEY: ${fwXPanKey}`);

return;
 


