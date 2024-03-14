# node-PAFW
Esta es una app desarrollada en node JavaScript que engloba un conjunto de utilitarios en base a la API proporcionada por PaloAlto para manejar sus Firewalls.

Para usarla, deberas ejecutar  **npm install** para resolver todas las dependencias.

Una vez instalada podras usar _node app -- help_ :

```
app [command]

Commands:
  app denials   Compare PA-FW denials with public cidr lists Azure IoT Hub
  app status    Request a status command from the FW
  app test      Test with dowaloaded CSV from PA
  app vpnusers  Show VPN Users

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

_Ejemplos_
```
node app test 
node app status -i 192.168.1.21 -u admin -p password 
node app vpnusers -i 192.168.1.21 -u admin -p password 
```
