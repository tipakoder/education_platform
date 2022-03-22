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
        
    }
}