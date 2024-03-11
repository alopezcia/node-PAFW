
const ipEnRangoCIDR = (ip, cidr) => {
    const [direccionBase, mascaraBits] = cidr.split('/');
    const mascara = (1 << (32 - mascaraBits)) - 1;

    // Calcula la dirección IP base
    const octetosBase = direccionBase.split('.').map(Number);
    const ipBase = (octetosBase[0] << 24) | (octetosBase[1] << 16) | (octetosBase[2] << 8) | octetosBase[3];

    // Convierte la dirección IP a un número entero
    const octetosDireccion = ip.split('.').map(Number);
    const ipDireccion = (octetosDireccion[0] << 24) | (octetosDireccion[1] << 16) | (octetosDireccion[2] << 8) | octetosDireccion[3];

    // Calcula la máscara de subred
    const mascaraInvertida = (1 << (32 - mascaraBits)) - 1;
    const mascaraFinal = ~mascaraInvertida >>> 0; // Operación NOT y convierte a entero sin signo

    // Realiza la operación AND entre la dirección IP y la máscara de subred
    return (ipBase & mascaraFinal) === (ipDireccion & mascaraFinal);
}

module.exports = {
    ipEnRangoCIDR: ipEnRangoCIDR
}