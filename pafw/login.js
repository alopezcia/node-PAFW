const axios = require('axios');
const https = require('https');
const xml2js = require('xml2js');

const agent = new https.Agent({ rejectUnauthorized: false});
const axiosInstance = axios.create();
axiosInstance.defaults.httpsAgent=agent;
const xml2jsParser = new xml2js.Parser();

const checkApiKey = async (ip, apikey) => 
{
    try{
        const response = await axiosInstance.post( `https://${ip}/api?type=version&key=${apikey}` );

        // console.log( response);
        const xmlData = response.data;
        // console.log(xmlData);
        const jsonData = await xml2jsParser.parseStringPromise(xmlData);
        const {status} = jsonData.response["$"];
        // console.log( JSON.stringify(jsonData.response));
        return status==='success';
    } catch (error) {
        // console.error(`Error al chequear ApiKey: ${error}`);
        return false;
    }
}

const getToken = async (ip, user, pass) => {
    let token='';
    try{
        const solicitud = `https://${ip}/api?type=keygen&user=${user}&password=${pass}`;
        // console.log(solicitud);
        const response = await axiosInstance.post( solicitud );
        const xmlData = response.data;
        // console.log(xmlData);
        const jsonData = await xml2jsParser.parseStringPromise(xmlData);
        // console.log( JSON.stringify(jsonData) );
        const {status } = jsonData.response["$"];
        const result  = jsonData.response["result"];
        // console.log( JSON.stringify(result) );

        if( status==='success' ){
            token = result[0].key[0];
            // console.log(token);
            return token;
        }
    }catch(error){
        console.error(`Error al obtener ApiKey: ${error}`);
    }
}

module.exports ={
    checkApiKey: checkApiKey,
    getToken: getToken
}