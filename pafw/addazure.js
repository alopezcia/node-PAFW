const { leerRangosDesdeJSON } = require('../util/leer-rangos-fs');

const addazure = async (ip, key, region, jsonfile ) => {
    try {
        const rangos = await leerRangosDesdeJSON(jsonfile);
        const filtrados = rangos.filter( item => item.name === region  );
        console.log( JSON.stringify(filtrados) );
    } catch( error ){
        console.error( error );
    }
}

module.exports = {
    addazure: addazure
}


/*
curl -k -X POST 'https://192.168.1.21/restapi/v10.2/Objects/Addresses?location=vsys&vsys=vsys1&name=web-servers-production' -H 'X-PAN-KEY: LUFRPT1leEsxZGdObEpDbHVqYXEwd2ttc3FKV3lveUU9UHFaNGc0MXQ3ZzdtZmJyTjlCNCttM2cyN3pldk1zN0F0aUgvejRUV3JUUXdFblJkalVNcjY0aUtta2pMUmpQRg==' -d '{"entry": [{"@location": "vsys","@vsys":"vsys1","@name": "web-servers-production","description": "what is this for?","fqdn": "docs.paloaltonetworks.com","tag": {"member": ["Blue"]}}]}'
{"@status":"success","@code":"20","msg":"command succeeded"}
*/