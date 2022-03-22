const os = require("os");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const expressFormData = require("express-form-data");

const Application = require("../Application");

/**
 * Express server
 * Class for request from user
 */
class ExpressServer {
    #app;
    #appOptions = {
        port: 8080,
        pathStaticsDirectory: __dirname,
    };
    
    /**
     * Constructor for express server
     */
    constructor (appOptions = this.#appOptions) {
        // Set app options
        this.#appOptions = appOptions;

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
                console.log(`Express server started on :${this.#appOptions.port}`);
            }
        )
    }
}

module.exports = ExpressServer;