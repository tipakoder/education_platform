const CustomError = require("./CustomError");

class ApiError extends CustomError {
    #code = 500;

    /**
     * Constructor
     * @param {string} content 
     */
    constructor (content = "Internal error", code = 500) {
        super(content);

        // Set custom code if needle
        if (code !== this.#code)
            this.#code = code;
    }

    /**
     * Convert error to JS object
     */
    toObject () {
        return {
            type: "error",
            data: {
                code: this.#code,
                message: this.message
            }
        }
    }

    /**
     * Access denied
     * @param {string} text 
     * @returns 
     */
    static forbidden(text = "Access denied") {
        return new ApiError(text, 403);
    }

    /**
     * Not found
     * @param {string} text 
     * @returns 
     */
    static notFound(text = "Not found") {
        return new ApiError(text, 404);
    }

    /**
     * Incorrect request
     * @param {string} text 
     * @returns 
     */
    static incorrectInput(text = "Incorrect request") {
        return new ApiError(text, 402);
    }
}

module.exports = ApiError;