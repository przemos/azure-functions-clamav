import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as NodeClam from 'clamscan';
import { Readable } from 'stream'
const scanner: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const base64EncodedFile = Buffer.from(req.body.file, 'base64');

    console.log('Scanning file: ' + req.body.file);
    const clamScan = await new NodeClam().init({
        clamdscan: {
            socket: false, // Socket file for connecting via TCP
            host: "127.0.0.1", // IP of host to connect to TCP interface
            port: "3310", // Port of host to use when connecting via TCP interface
            timeout: 60000, // Timeout for scanning files
            local_fallback: false, // Do no fail over to binary-method of scanning
            multiscan: true, // Scan using all available cores! Yay!
            reload_db: false, // If true, will re-load the DB on every call (slow)
            active: true, // If true, this module will consider using the clamdscan binary
            bypass_test: false, // Check to see if socket is available when applicable
        },
        preference: 'clamdscan' // If clamdscan is found and active, it will be used by default
    });

    const rs = new Readable();
    rs.push(base64EncodedFile);
    rs.push(null);

    const { is_infected, viruses } = await clamScan.scan_stream(rs);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            is_infected: is_infected,
            instance_id: process.env.WEBSITE_INSTANCE_ID
        }
    };
};

export default scanner;