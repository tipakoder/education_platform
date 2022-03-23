const Logger = require("./src/utils/Logger");
const Application = require("./src/core/Application");


/** --- PRE INITIALIZE --- **/

Logger.clear();

// Get enviroment variables
require("dotenv").config();

// Set root directory
Application.setRootDirectory(__dirname);


/** --- INITIALIZE --- **/

Logger.info("INITIALIZE");

// Start application initialize
Application.initialize();