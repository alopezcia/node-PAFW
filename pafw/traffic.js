const { axiospafw } = require('./axiospafw');


const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

const traffic = async (ip, apikey, filter) => 
{
	let filtro = filter;
	if( filtro.length === 0  ){
		// Si no nos pasan un filtro, acotamos con lo recibido en el dia de hoy 
		const dt = new Date();
		filtro = `(receive_time geq '${dt.getFullYear()}/${padL(dt.getMonth()+1)}/${padL(dt.getDate())} 00:00:00')`;
	}
    console.log( 'Filter: ', filtro );
    const enqueued = await axiospafw(`https://${ip}/api?type=log&log-type=traffic&query=${filtro}&nlogs=5000&key=${apikey}`);
    console.log( enqueued.msg.line );
    const job = enqueued.job;

	const entradas = [];
	try{
		let skip=0;
		while( true ){
			const entries = await axiospafw(`https://${ip}/api?type=log&action=get&job-id=${job}&skip=${skip}&key=${apikey}`);
			const status = entries.job.status;
			const progress = entries.log.logs["$"].progress;
			if( entries.log.logs["entry"]  ){
				const count = Number(entries.log.logs["$"].count);
				if( count > 1  ){
					skip += count;
					console.log( `Status: ${status}, Count: ${count}, Progress: ${progress}, Skip: ${skip}` );
					const entr = entries.log.logs["entry"].map( elemento =>{ 
						const logid = elemento["$"].logid;
						const src = elemento["src"];
						const dst = elemento["dst"];
						const dport = elemento["dport"];
						const action = elemento["action"];
						const time_received = elemento["time_received"];
						const sessionid = elemento["sessionid"];
						return { logid, src, dst, dport, action, time_received, sessionid }
					});
					entradas.push(...entr);
				}
			} else {
				await new Promise(r => setTimeout(r, 1000));		// esperamos un segundo para no agobiar al servidor
			}
			if( status === 'FIN' && progress === '100' ){
				break;
			}
		}

	}
	catch( error ) {
		console.error(error);
	};
    // {"logs":{"$":{"count":"0","progress":"0"}}}
  
    await axiospafw(`https://${ip}/api?type=log&action=finish&job-id=${job}&key=${apikey}`, true);
	console.log( `Nº entradas: ${ entradas.length }` );
    return entradas;
}

module.exports = {
    traffic: traffic,
	padL: padL
}

/*
{
	"$":{
		"logid":"7343775600871350748"
	},
	"domain":"1",
	"receive_time":"2024/03/08 19:07:32",
	"serial":"023001003689",
	"seqno":"7312397927191077983",
	"actionflags":"0x0",
	"is-logging-service":"no",
	"type":"TRAFFIC",
	"subtype":"end",
	"config_ver":"2561",
	"time_generated":"2024/03/08 19:07:32",
	"high_res_timestamp":"2024-03-08T19:07:33.702+01:00",
	"src":"10.132.0.165",
	"dst":"195.76.142.188",
	"rule":"Allow_WANDAS_TRACA PO",
	"srcloc":{
		"_":"10.0.0.0-10.255.255.255",
		"$":{
			"code":"10.0.0.0-10.255.255.255",
			"cc":"10.0.0.0-10.255.255.255"
		}
	},
	"dstloc":{
		"_":"Spain",
		"$":{
			"code":"Spain",
			"cc":"ES"
		}
	},
	"app":"ssl",
	"vsys":"vsys1",
	"from":"WANDAS",
	"to":"DMZ-2",
	"inbound_if":	"ethernet1/2",
	"outbound_if":"ethernet1/4",
	"time_received":"2024/03/08 19:07:32",
	"sessionid":"46063",
	"repeatcnt":"1",
	"sport":"56904",
	"dport":"443",
	"natsport":"0",
	"natdport":"0",
	"flags":"0x47a",
	"flag-pcap":"no",
	"flag-flagged":"no",
	"flag-proxy":"no",
	"flag-url-denied":"no",
	"flag-nat":"no",
	"captive-portal":"no",
	"non-std-dport":"no",
	"transaction":"no",
	"pbf-c2s":"no",
	"pbf-s2c":"no",
	"temporary-match":"no",
	"sym-return":"no",
	"decrypt-mirror":"no",
	"credential-detected":"no",
	"flag-mptcp-set":"no",
	"flag-tunnel-inspected":"no",
	"flag-recon-excluded":"no",
	"flag-wf-channel":"no",
	"proto":"tcp",
	"action":"allow",
	"tunnel":"N/A",
	"tpadding":"0",
	"cpadding":"0",
	"rule_uuid":"6e9b1a18-f816-4b66-940c-295d72629be3",
	"s_decrypted":"0",
	"s_encrypted":"1",
	"vpadding":"0",
	"category_of_app":"networking",
	"subcategory_of_app":"encrypted-tunnel",
	"technology_of_app":"browser-based",
	"characteristic_of_app":"used-by-malware,able-to-transfer-file,has-known-vulnerability,tunnel-other-application,pervasive-use",
	"tunneled_app":"ssl",
	"risk_of_app":"4",
	"is_saas_of_app":"no",
	"sanctioned_state_of_app":"no",
	"bpadding":"0",
	"dg_hier_level_1":"0",
	"dg_hier_level_2":"0",
	"dg_hier_level_3":"0",
	"dg_hier_level_4":"0",
	"device_name":"PAN_AMAEM_IT_ALI_01",
	"vsys_id":"1",
	"tunnelid_imsi":"0",
	"parent_session_id":"0",
	"bytes":"34113",
	"bytes_sent":"2465",
	"bytes_received":"31648",
	"packets":"52",
	"start":"2024/03/08 19:07:07",
	"elapsed":"10",
	"category":"business-and-economy",
	"traffic_flags":"0x1c",
	"flag-decrypt-forwarded":"no",
	"flag-l7-skipped":"no",
	"pkts_sent":"23",
	"pkts_received":"29",
	"session_end_reason":"tcp-fin",
	"action_source":"from-policy",
	"assoc_id":"0",
	"chunks":"0",
	"chunks_sent":"0",
	"chunks_received":"0",
	"http2_connection":"0",
	"link_change_count":"0",
	"sdwan_fec_data":"0",
	"offloaded":"0",
	"tunnelid":"0",
	"imsi":"",
	"monitortag":"0",
	"imei":""
}
*/