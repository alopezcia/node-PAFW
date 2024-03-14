const { traffic, padL } = require('./traffic');
const { leerRangosDesdeJSON }= require('../util/leer-rangos-fs');
const { ipEnRangoCIDR }= require('../util/ip-en-rango');

const azured = async (ip, key, deny, period ) => {
    const dt = new Date();
    const days=Number(period);
    dt.setDate( dt.getDate() - days );
    const filtro = `(addr.src in ${deny}) and (receive_time geq '${dt.getFullYear()}/${padL(dt.getMonth()+1)}/${padL(dt.getDate())} 00:00:00') and ( action eq 'deny' )`; 
    const datos = await traffic( ip, key, filtro );
    const datosUnicos = [];
    const valoresVistos = {};

    datos.forEach((elemento) => {
        const valor = `${elemento.dst}_${elemento.dport}`;
        if (!valoresVistos[valor]) {
            datosUnicos.push(elemento);
            valoresVistos[valor] = true;
        }
    });

    const rangos = leerRangosDesdeJSON('rangos.json');

    datosUnicos.forEach(element => {
        for (const rango of rangos) {
            if (rango.addressPrefixes.some(prefix => ipEnRangoCIDR(element.dst, prefix.cidr))) {
                console.log(`${element.logid}, ${element.time_received}, ${element.src}, ${element.dst}, ${element.dport}, ${rango.name}, (${rango.regionId})`);
                break;
            }
        }
    });
};

module.exports = {
    azured: azured
}