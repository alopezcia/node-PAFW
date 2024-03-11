const axios = require('axios');
const https = require('https');
const xml2js = require('xml2js');

const agent = new https.Agent({ rejectUnauthorized: false});
const axiosInstance = axios.create();
axiosInstance.defaults.httpsAgent=agent;
const xml2jsParser = new xml2js.Parser({explicitArray: false});

const status = async (ip, apikey) => 
{
    try{
        const response = await axiosInstance.post( `https://${ip}/api?type=op&cmd=<show><system><info></info></system></show>&key=${apikey}` );
        const xmlData = response.data;
        // console.log(xmlData);
        const jsonData = await xml2jsParser.parseStringPromise(xmlData);

        const {status} = jsonData.response["$"];
        console.log( JSON.stringify(jsonData.response));
        return status==='success';
    } catch (error) {
        // console.error(`Error al chequear ApiKey: ${error}`);
        return false;
    }
}



module.exports = {
    status: status
}