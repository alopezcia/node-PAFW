const { axiospafw } = require('./axiospafw');

const checkApiKey = async (ip, apikey) => 
{
    const entries = await axiospafw(`https://${ip}/api?type=version&key=${apikey}`);
//    console.log( 'checkApiKey', entries.key );
    return  ( entries );
}

const getToken = async (ip, user, pass) => {
    const entries = await axiospafw(`https://${ip}/api?type=keygen&user=${user}&password=${pass}`);
//    console.log( 'getToken', entries.key );
    if( entries )
        return entries['key'];
    else
        return undefined;
}

module.exports ={
    checkApiKey: checkApiKey,
    getToken: getToken
}