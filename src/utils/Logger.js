const colors = require("colors");

/**
 * Custom logger
 * Class for write log to files and to console
 */
class Logger {
    #name = "";
    #options = {
        outputToConsole: true,
        outputToFile: false
    };

    /**
     * Constructor for logger
     * @param {string} name 
     * @param {object} options 
     */
    constructor (
        name = "personal", 
        options = this.#options
    ) {
        this.#name = name;
        this.#options = Object.assign(this.#options, options);
    }

    /**
     * Get formated date
     * @returns {string}
     */
    static #getFormatedDate () {
        return (new Date()).toISOString().slice(0, 19).replace(/-/g, ".").replace("T", " ");
    }

    /**
     * Process input print data
     * @param {any} data
     */
    static #processInputData (data) {        
        if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                if (typeof data[i] === "object") {
                    data[i] = JSON.stringify(data[i]);
                }
            }
            return data.join(" ");
        } else if (typeof data === "object") {
            return JSON.stringify(data);
        } else {
            return data;
        }
    }

    /**
     * Clear console
     */
    static clear () {
        process.stdout.write('\u001Bc');
        console.clear();
    }

    /**
     * Print to console
     * @param {array|string} data 
     */
    static print (data) {
        console.log(Logger.#processInputData(data));
    }

    /**
     * Print on template
     * @param {array|string} data 
     */
    static templatePrint (data) {
        this.print(
            [
                `${colors.cyan(`[${Logger.#getFormatedDate()}]`)}${colors.blue(`[PID:${process.pid}]`)}`, 
                Logger.#processInputData(data)
            ]
        );
    } 

    templatePrint (data) {
        Logger.templatePrint(
            [
                colors.yellow(`[${this.#name}]`),
                Logger.#processInputData(data)
            ]
        );
    }

    /**
     * Print information
     * @param {Array|string} data 
     */
    static info (data) {
        this.templatePrint([colors.green(`INFO:`), Logger.#processInputData(data)]);
    }
    
    /**
     * Print warning information
     * @param {array|string} data 
     */
    static warning (data) {
        this.templatePrint([colors.yellow(`WARNING:`), Logger.#processInputData(data)]);
    }

    
    /**
     * Print error information
     * @param {array|string} data 
     */
    static error (data) {
        this.templatePrint([colors.red(`ERROR:`), Logger.#processInputData(data)]);
    }

    /**
     * Print critical error information
     * @param {array|string} data 
     */
    static critical (data) {
        this.templatePrint([colors.red(`CRITICAL ERROR:`), Logger.#processInputData(data)]);
        process.exit(1);
    }

    /**
     * Print debug information
     * @param {array|string} data 
     */
    static debug (data) {
        this.templatePrint([colors.cyan(`DEBUG:`), Logger.#processInputData(data)]);
    }

    /**
     * Get personal logger for module
     * @param {string} moduleName
     * @returns {PersonalLogger} 
     */
    static getPersonalLogger(moduleName) {
        return new PersonalLogger(moduleName);
    }

    /**
     * Get colors
     * @returns 
     */
    static getColors() {
        return colors;
    }
}

module.exports = Logger;