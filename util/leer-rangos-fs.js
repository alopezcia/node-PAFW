const fs = require('fs');

// Función para leer los rangos desde un archivo JSON y filtrar direcciones IPv4
const leerRangosDesdeJSON = (archivo) => {
    try {
        const data = fs.readFileSync(archivo, 'utf8');
        const json = JSON.parse(data);
        if (json.values && Array.isArray(json.values)) {
            return json.values
                .filter(item => item.properties.regionId !== 0) // Ignorar rangos con regionId igual a 0
                .map(item => ({
                    region: item.properties.region,
                    regionId: item.properties.regionId,
                    name: item.name,
                    id: item.id,
                    addressPrefixes: item.properties.addressPrefixes
                    .filter(prefix => prefix.includes('.')) // Filtrar direcciones IPv4
                    .map(prefix => {
                        const [direccionBase, mascaraBits] = prefix.split('/');
                        return {
                            cidr: prefix,
                            // mascara: (1 << (32 - mascaraBits)) - 1,
                            // octetos: direccionBase.split('.').map(Number),
                            // octetosIp: ip.split('.').map(Number),
                        };
                    })
                    // .map( elemento => { 
                    //     return {
                    //         ...elemento,
                    //         ipBase: elemento.octetos[0] * 256 ** 3 + elemento.octetos[1] * 256 ** 2 + elemento.octetos[2] * 256 + elemento.octetos[3],
                    //         ipDireccion:  elemento.octetosIp[0] * 256 ** 3 + elemento.octetosIp[1] * 256 ** 2 + elemento.octetosIp[2] * 256 + elemento.octetosIp[3],
                    //     }
                    // })
                    // .map( elemento => {
                    //     return {
                    //         ...elemento,
                    //         andOperacion1: (elemento.ipBase & elemento.mascara ),
                    //         andOperation2: (elemento.ipDireccion & elemento.mascara )
                    //     }
                    // } )
                }));
        }
        return [];
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        return [];
    }
}

module.exports = {
    leerRangosDesdeJSON: leerRangosDesdeJSON 
}