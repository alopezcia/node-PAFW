const axios = require('axios');
const https = require('https');
const xml2js = require('xml2js');

const agent = new https.Agent({ rejectUnauthorized: false});
const axiosInstance = axios.create();
axiosInstance.defaults.httpsAgent=agent;
const xml2jsParser = new xml2js.Parser({explicitArray: false});

// returnStatus es para devolver unicamente el resultado true o false de la invocación
const axiospafw = async (url, returnStatus=false) => 
{
    try{
        const response = await axiosInstance.post( url );
        const xmlData = response.data;
        const jsonData = await xml2jsParser.parseStringPromise(xmlData);
        const {status} = jsonData.response["$"];
        if( status==='success' ){
            if( returnStatus )
                return true;
            const entries  = jsonData.response["result"];
            return entries;
        }
        else {
            return undefined;
        }
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

module.exports = {
    axiospafw: axiospafw
}