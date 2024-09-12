const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();

const SSH_CONFIG = {
    host: '192.168.1.13',
    port: 22,
    username: 'root',
    agent: process.env.SSH_AUTH_SOCK,
};

const LOCAL_PATH_SH = path.join(__dirname, 'script.sh');
const REMOTE_PATH_SH = '/tmp/script.sh';

function deploy() {
    return new Promise((resolve, reject) => {
        conn.on('ready', () => {
            console.log('conexion lista');

            conn.sftp((err, sftp) => {
                if (err) return reject(err);

                sftp.fastPut(LOCAL_PATH_SH, REMOTE_PATH_SH, (err) => {
                    if (err) return reject(err);
                    console.log('script montado');

                    conn.exec(`bash ${REMOTE_PATH_SH}`, (err, stream) => {
                        if (err) return reject(err);

                        stream.on('close', (code, signal) => {
                            console.log(`Stream closed with code: ${code}, signal: ${signal}`);
                            conn.end();
                            resolve();
                        }).on('data', (data) => {
                            console.log('STDOUT: ' + data);
                        }).stderr.on('data', (data) => {
                            console.error('STDERR: ' + data);
                        });
                    });
                });
            });
        }).on('error', (err) => {
            console.error('Error:', err);
            reject(err);
        }).connect(SSH_CONFIG);
    });
}

module.exports = deploy;