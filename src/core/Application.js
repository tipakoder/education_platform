const fs = require("fs");
const path = require("path");
const MongoDB = require("./database/MongoDB");
const SystemError = require("./errors/SystemError");
const ExpressServer = require("./server/ExpressServer");

/**
 * The main class of application
 * Controls the main parameters of the application
 */
class Application {
    /**
     * Path of specific folders
     */
    static #rootDirectory;
    static #staticsDirectory;
    static #logDirectory;

    /**
     * Express user server
     */
    static #expressServer;

    /**
     * Mongodb connection
     */
    static #mongodbConnection;

    /**
     * Set the path to the root directory
     * @param {string} path
     */
    static setRootDirectory (pathRootDirectory = "") {
        if (typeof pathRootDirectory !== "string")
            throw SystemError.TypeError("Path");

        // Settings linked folders
        Application.#rootDirectory = pathRootDirectory;
        Application.#logDirectory = path.join(pathRootDirectory, "logs");
        Application.#staticsDirectory = path.join(pathRootDirectory, "statics");
    }
    /**
     * Get the path of the root directory
     */
    static getRootDirectory () {
        return Application.#rootDirectory;
    }
    /**
     * Get the path of the statics directory
     */
    static getStaticsDirectory () {
        return Application.#staticsDirectory;
    }
    /**
     * Get the path of the statics directory
     */
    static getLogDirectory () {
        return Application.#logDirectory;
    }

    /**
     * Initialize application
     */
    static initialize () {
        const config = require("../../configs/application");

        // Setup .env default if not exists
        if (!fs.existsSync(".env") && fs.existsSync(".env.example")) {
            fs.copyFileSync(".env.example", ".env");
            Application.#restart();
        }
        
        // Creating required folders if needle
        for (const folderPath of config.requiredFolders) {
            const folderGlobalPath = path.join(Application.getRootDirectory(), folderPath);
            if (!fs.existsSync(folderGlobalPath))
                fs.mkdirSync(folderGlobalPath, {recursive: true});
        }

        // Setup and connect mongo database
        this.#mongodbConnection = new MongoDB(
            {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                name: process.env.DB_NAME,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
            }
        );
        this.#mongodbConnection.initialize();

        // Setup and start express server
        this.#expressServer = new ExpressServer(
            {
                port: parseInt(process.env.EXPRESS_PORT),
                pathStaticsDirectory: Application.getStaticsDirectory(),
                pathModulesDirectory: path.join(Application.getRootDirectory(), process.env.EXPRESS_MODULES_PATH),
            }
        );
        this.#expressServer.start();
    }

    /**
     * Restart application
     */
    static #restart () {
        // Set callback on exit
        process.on("exit", function () {
            console.log("RESTART APP");

            // Spawn copy of current process
            require("child_process")
                .spawn(
                    process.argv.shift(),
                    process.argv,
                    {
                        cwd: process.cwd(),
                        detached: true,
                        stdio: "inherit"
                    }
                );
        });
        // Exit
        process.exit();
    }
}

module.exports = Application;