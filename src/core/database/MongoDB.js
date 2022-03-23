const fs = require("fs");
const mongoose = require("mongoose");
const Logger = require("../../utils/Logger");

/**
 * MongoDB
 * Class for work with mongo database
 */
class MongoDB {
    #logger;
    #options = {
        host: "127.0.0.1",
        port: 27017,
        name: "EDU_PLATFORM",
        user: "admin",
        password: "locally",
        pathToPresets: __dirname + "/presets.js"
    }

    /**
     * Constructor for mongodb
     * @param {object} options 
     */
    constructor (options = this.#options) {
        // Set options
        this.#options = Object.assign(this.#options, options);

        // Setup logger
        this.#logger = new Logger("mongodb");
    }

    /**
     * Connection to server
     */
    connect () {
        this.#logger.templatePrint(`connection to server`);
        mongoose.connect(`mongodb://${this.#options.host}:${this.#options.port}/${this.#options.name}`, {
            user: this.#options.user,
            pass: this.#options.password,
            autoIndex: true,
            autoCreate: true
        });

        mongoose.connection.on("connected", () => {
            this.#logger.templatePrint([`connection successfully`]);
        });
    }

    /**
     * Load db models
     */
    loadModels () {
        // Scan directory and get models list
        let modelsList;
        if ((modelsList = fs.readdirSync(__dirname + "/models")).length <= 1)
            return;

        this.#logger.templatePrint(`load models`);
        
        // Require all models
        for (const model of modelsList){
            // Ignore index.js
            if (model === "index.js")
                continue;

            this.#logger.templatePrint(`model '${/(\w+)\.js/.exec(model)[1]}' loaded`);

            // Require
            require (`./models/${model}`);
        }
    }

    /**
     * Insert presets
     */
    insertPresets () {
        if (!fs.existsSync(this.#options.pathToPresets))
            return;
        
        // Require preset function
        const presetsFunction = require(this.#options.pathToPresets);

        // If it is not a function - leave
        if (typeof presetsFunction !== "function")
            return;
        
        // Run presets
        presetsFunction();
    }

    /**
     * MongoDB
     * Initialize connection
     */
    initialize () {
        this.loadModels();
        this.insertPresets();
        this.connect();
    }
}

module.exports = MongoDB;