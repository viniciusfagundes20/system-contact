import fs from 'fs';
import { resolve } from 'path';

export const TypeLogs = {
    Alert: 'ALERT',
    Info: 'INFO',
    Trace: 'TRACE'
}

export default class clsLog {

    static getFileName() {

        let date = new Date();
        return `log_${date.getFullYear()}${('0' + (date.getMonth() + 1)).slice(-2)}${('0' + date.getDate()).slice(-2)}.txt`;

    }

    static getFullMoment() {

        let date = new Date();
        return `[${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}]`;

    }

    static async create(msg, type = 'ALERT') {

        try 
        {

            // Cria a pasta de log's caso não exista.
            if(!fs.existsSync(resolve('logs'))){
                fs.mkdirSync('./logs');
            }

            await fs.appendFileSync(resolve('logs', this.getFileName()), 
                `${this.getFullMoment()} - ${type} - ${msg}\n`,
                { 
                    encoding: "utf8", 
                    flag: "a" 
                });

        }
        catch (ex) 
        {

            console.log('ERROR: ' + ex.message);

        }

    }

    static async clear() {

        try 
        {

            await fs.unlinkSync(resolve('logs', this.getFileName()));

        }
        catch (ex) 
        {

            console.log('ERROR: ' + ex.message);

        }

    }

}
