const { axiospafw } = require('./axiospafw');

const status = async (ip, apikey) => 
{
    const entries = await axiospafw(`https://${ip}/api?type=op&cmd=<show><system><info></info></system></show>&key=${apikey}`);
    // console.log( JSON.stringify(jsonData.response));
    console.log( entries );
    return ( entries );
}

module.exports = {
    status: status
}