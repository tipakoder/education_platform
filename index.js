const Application = require("./src/core/Application");


/** --- PRE INITIALIZE --- **/

// Get enviroment variables
require("dotenv").config();

// Set application variables
Application.setRootDirectory(__dirname);


/** --- INITIALIZE --- **/

// Start application initialize
Application.initialize();