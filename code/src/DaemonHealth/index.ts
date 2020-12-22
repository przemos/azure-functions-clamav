import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as util from 'util'
import { exec } from 'child_process'

const daemonHealth: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('DaemonHealth started');

    const execPromisified = util.promisify(exec);

    const port = 3310;
    let status = 0;
    try {
        const result = await execPromisified("echo -n 'PING' | nc localhost " + port)
        context.log(result.stdout)
        context.log(result.stderr)
        if (result.stdout == 'PONG\n') {
            context.log("OK");
        } else {
            context.log("NO PONG");
        }
        /*
        .stdout
        .stderr
        */
    } catch (err) {
        /*
        .killed: false,
        .code: 127,
        .signal: null,
        .cmd: 'freshclam',
        .stdout: '',
        .stderr: '/bin/sh: freshclam: command not found\n'
   */
        status = err.code
        context.log("Daemon response exception");

    }
    context.res = {
        body: status
    };
};

export default daemonHealth;