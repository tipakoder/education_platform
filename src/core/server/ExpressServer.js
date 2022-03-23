const os = require("os");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const expressFormData = require("express-form-data");

const Logger = require("../../utils/Logger");
const ApiError = require("../errors/ApiError");

/**
 * Express server
 * Class for request from user
 */
class ExpressServer {
    #app;
    #logger;
    #appOptions = {
        port: 8080,
        pathStaticsDirectory: __dirname,
        pathModulesDirectory: __dirname
    };
    
    /**
     * Constructor for express server
     */
    constructor (appOptions = this.#appOptions) {
        // Set app options
        this.#appOptions = Object.assign(this.#appOptions, appOptions);

        // Setup logger
        this.#logger = new Logger("express-server");

        // Create express-server
        this.#app = express();
        // Enable cors
        this.#app.use(cors());

        // Make another setup for form-data and json processing
        this.#app.use(bodyParser.json());
        this.#app.use(bodyParser.urlencoded({extended: false}));
        this.#app.use(
            expressFormData.parse({
                uploadDir: os.tmpdir(),
                autoClean: true,
            })
        );
        this.#app.use(expressFormData.format());
        this.#app.use(expressFormData.stream());
        this.#app.use(expressFormData.union());
        
        // Setup statics
        this.#app.use("/api/statics", express.static(this.#appOptions.pathStaticsDirectory));
        
        // Setup REST API
        this.#app.use("/api/:module/:action", (req, res) => {
            try {
                // Set required variables
                const {module, action} = req.params;

                // Get incoming data
                const data = req.method === "POST" ? req.body : req.query ?? {}

                // Try to get needle module
                const requestModulePath = path.join(this.#appOptions.pathModulesDirectory, `${module}.js`);
                if (!fs.existsSync(requestModulePath))
                    throw ApiError.notFound(`Module '${module}' not found`);

                // Require request module
                const requestModule = require(requestModulePath);

                // Try to get needle action
                if (!requestModule[action]) 
                    throw ApiError.notFound(`Module '${module}' haven't action '${action}'`);

                // Run method and save response
                const response = requestModule[action]();
            } catch (e) {
                const response = e.toObject ? e.toObject() : (new ApiError(e.toString())).toObject();
                res.status(response.data.code).json(response).end();
            }
        });
    }

    /**
     * Start to listen port
     */
    start () {
        // Start to listen out him
        this.#app.listen(
            this.#appOptions.port,
            () => {
                this.#logger.templatePrint([`started on`, Logger.getColors().yellow(`:${this.#appOptions.port}`)]);
            }
        )
    }
}

module.exports = ExpressServer;