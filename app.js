const { argv, doSwitch } = require('./config/yargs');
const { checkApiKey, getToken } = require('./pafw/login');
const { setEnvValue } = require('./util/writeenv');

require('dotenv').config();


// 1º Obtener parámetros
const fwIP = argv.ip;
const cmd = argv._[0];
let fwUsername = process.env.USERNAME;
if( argv.username ){
    fwUsername = argv.username;
}
if( fwUsername === 'undefined' ){
    fwUsername = undefined;
}

let fwPassword = '';
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

// 2º Controlar existencia de crendeciales o de token
// Preferencia existencia de token
// validar token
let apikeyValido = false;
if( fwXPanKey  && fwXPanKey.length > 0   ){
    const c = checkApiKey( fwIP, fwXPanKey );
    c.then( checked => {
        if( checked ){
            doSwitch( cmd, fwIP, fwXPanKey );
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
                doSwitch( cmd, fwIP, token ); 
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
 
// =============================================================================================


// URL para descargar la lista de rangos de direcciones IP de Microsoft
const microsoftIPsURL = 'https://www.microsoft.com/en-us/download/confirmation.aspx?id=56519';

// Función para descargar la lista de IPs de Microsoft
async function descargarIPsMicrosoft() {
    try {
        // Descarga la lista de IPs de Microsoft
        const response = await axios.get(microsoftIPsURL);
        const xmlData = response.data;

        // Parsea el XML a JSON
        const parser = new xml2js.Parser();
        const jsonData = await parser.parseStringPromise(xmlData);
        console.log(JSON.stringify(jsonData.html.body));
        // console.log(jsonData.html.body);

        // Extrae los rangos de direcciones IP
        const microsoftRanges = jsonData.AzurePublicIpAddresses.Region[0].IpRange.map(range => range.$.Subnet);

        return microsoftRanges;
    } catch (error) {
        console.error(`Error al descargar o procesar la lista de IPs de Microsoft: ${error}`);
        throw error;
    }
}

// Función para descargar las reglas de denegación del firewall Palo Alto
async function descargarReglasDenegacion() {
    try {
        // Realiza la solicitud GET a la API de Palo Alto para obtener las reglas de denegación
        const response = await axios.get(`https://${fwIP}/api/running-config/rules`, {
            auth: {
                username: fwUsername,
                password: fwPassword
            }
        });

        // Filtrar las reglas de denegación
        const reglasDenegacion = response.data.rulebase.security.rules.entry.filter(entry => entry.action === 'deny');

        return reglasDenegacion;
    } catch (error) {
        console.error(`Error al descargar las reglas de denegación del firewall: ${error}`);
        throw error;
    }
}

// Función para comparar las reglas de denegación con los rangos de IPs de Microsoft
async function compararReglasConMicrosoft() {
    try {
        const microsoftRanges = await descargarIPsMicrosoft();
        const reglasDenegacion = await descargarReglasDenegacion();

        // Buscar si algún rango de IPs de Microsoft está siendo bloqueado
        const rangosBloqueados = reglasDenegacion.filter(rule => {
            const ipRange = rule.destination['member'];
            return microsoftRanges.some(microsoftIP => ipRange.includes(microsoftIP));
        });

        if (rangosBloqueados.length > 0) {
            console.log("Los siguientes rangos de IPs de Microsoft están siendo bloqueados:");
            rangosBloqueados.forEach(rule => {
                console.log(`- Regla: ${rule.name}, IPs: ${rule.destination['member'].join(', ')}`);
            });
        } else {
            console.log("No se están bloqueando rangos de IPs de Microsoft.");
        }
    } catch (error) {
        console.error(`Error al comparar las reglas de denegación con los rangos de IPs de Microsoft: ${error}`);
    }
}




