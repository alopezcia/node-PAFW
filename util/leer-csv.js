const fs = require('fs');
const csv = require('csv-parser');
const { leerRangosDesdeJSON } = require('./leer-rangos-fs');
const { ipEnRangoCIDR } = require('./ip-en-rango');


const leerCSV = (nombreArchivo, propiedad, callback ) => {
    let datos = [];
    let nombresColumna = [];

    fs.createReadStream(nombreArchivo)
        .pipe(csv())
        .on('headers', (headers) => {
            // Almacena los nombres de las columnas
            nombresColumna = headers;
        })
        .on('data', (data) => {
            // Convierte cada fila en un objeto usando los nombres de las columnas
            let fila = {};
            nombresColumna.forEach((nombre) => {
                fila[nombre] = data[nombre];
            });
            datos.push(fila);
        })
        .on('end', () => {
            // Aquí ya tienes los datos en formato de arreglo de objetos
            // fs.writeFile('datos.json', JSON.stringify(datos), (err) => {
            //     if (err) throw err;
            //     console.log('Los datos se han guardado correctamente en datos.json');
            // })
            
            // Eliminar filas duplicadas basadas en el atributo especificado
            const datosUnicos = [];
            const valoresVistos = {};

            datos.forEach((elemento) => {
                const valor = elemento[propiedad];
                if (!valoresVistos[valor]) {
                    datosUnicos.push(elemento);
                    valoresVistos[valor] = true;
                }
            });

            // Llama a la función de devolución de llamada con los datos únicos
            callback(datosUnicos.map(  elemento => {
                return { ip: elemento[propiedad], port: elemento['Destination Port']} 
            }));        
        });
}


// ===================================================================================================================
const test = () => {
    if( !fs.existsSync('log.csv') ){
        console.log('No existe fichero log.csv. Genera uno con el monitor de trafico del Panorama ');
        return;
    }
    leerCSV('log.csv',  'Destination address', (datos) => {
        // Ejemplo de uso
        datos.forEach(element => {
            const ip = element.ip;
            const port = element.port;
            const rangos = leerRangosDesdeJSON('rangos.json', ip);
            let pertenece = false;
            let region;
            let regionId;
            let nombre;
            let identificador;
            let prefijo;
    
            for (const rango of rangos) {
                if (rango.addressPrefixes.some(prefix => ipEnRangoCIDR(ip, prefix.cidr))) {
                    pertenece = true;
                    region = rango.region;
                    regionId = rango.regionId;
                    nombre = rango.name;
                    identificador = rango.id;
                    prefijo = rango.addressPrefixes;
                    break;
                }
            }
    
            if (pertenece) {
                console.log(`La dirección IP ${ip} Puerto ${port} pertenece a la región ${region} (${regionId}) nombre: ${nombre} identificador: ${identificador}.`);
                // console.log(`Nombre: ${nombre}`);
                // console.log(`ID: ${identificador}`);
                const pp = JSON.stringify(prefijo);
                console.log(`Prefijos: ${pp}`);
            } else {
                console.log(`La dirección IP ${ip}  Puerto ${port} no está en ninguno de los rangos especificados.` );
            }
        });
    });
}

module.exports = {
    leerCSV: leerCSV,
    test: test
}