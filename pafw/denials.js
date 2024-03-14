const { traffic, padL } = require('./traffic');

const denials = async (ip, key, deny, period ) => {
    const dt = new Date();
    const days=Number(period);
    dt.setDate( dt.getDate() - days ); // filtrar por una semana
    const filtro = `(addr.src in ${deny}) and (receive_time geq '${dt.getFullYear()}/${padL(dt.getMonth()+1)}/${padL(dt.getDate())} 00:00:00') and ( action eq 'deny' )`; 
    // const filtro = `(receive_time geq '${dt.getFullYear()}/${padL(dt.getMonth()+1)}/${padL(dt.getDate())} 00:00:00') and ( action eq 'deny' )`; 
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

    console.log( `      Denials for ${deny}`);
    console.log( '============================================================================= ');
    console.log( '      logid          Time               Src            Dst          Port');
    console.log( '============================================================================= ');
    datosUnicos.forEach(element => {
        console.log(`${element.logid}, ${element.time_received}, ${element.src}, ${element.dst}, ${element.dport}`);
    });
};

module.exports = {
    denials: denials
}
