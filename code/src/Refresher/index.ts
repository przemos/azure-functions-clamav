import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as util from 'util'
import { exec } from 'child_process'
const refresher: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Refresher started');
  
    const execPromisified = util.promisify(exec);

    let status = 0;
    try { 
        const result = await execPromisified("freshclam")
        /*
        .stdout
        .stderr
        */
    } catch(err) {
        /*
        .killed: false,
        .code: 127,
        .signal: null,
        .cmd: 'freshclam',
        .stdout: '',
        .stderr: '/bin/sh: freshclam: command not found\n'
   */
        status = err.code
    }
    context.res = {
        body : status
    };
};

export default refresher;