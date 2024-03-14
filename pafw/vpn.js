const { axiospafw } = require('./axiospafw');

const vpnUsers = async (ip, apikey) => 
{
    const entries = await axiospafw(`https://${ip}/api?type=op&cmd=<show><global-protect-gateway><current-user/></global-protect-gateway></show>&key=${apikey}`);
    if( entries ){
        const users = entries.entry.map( (entry) => {
            const username = entry.username;
            const computer = entry.computer;
            const ipVirtual = entry["virtual-ip"];
            const ipPublic = entry["public-ip"];
            const timeLogin = entry["login-time"];
            return { username, computer, ipVirtual, ipPublic, timeLogin }
        });
        console.log( users );
        return users;
    } else 
        return undefined;
}

module.exports = {
    vpnUsers: vpnUsers
}