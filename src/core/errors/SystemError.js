const CustomError = require("./CustomError");

class SystemError extends CustomError {
    #type = "syntax";

    /**
     * Constructor
     * @param {any} content 
     */
    constructor (content, type = "syntax") {
        super(content);

        // Set custom type if needle
        if (type !== this.#type)
            this.#type = type;
    }

    /**
     * Convert error to JS object
     */
    toObject () {
        return Object.assign(
            super.toObject(),
            {
                type: this.#type
            }
        )
    }

    /**
     * Type error
     * @param {string} variableName
     * @param {string} needleType
     */
    static TypeError (variableName = "", needleType = "string") {
        return new SystemError(`TypeError: "${variableName}" must be of type "${needleType}"`, "type_error");
    }
}

module.exports = SystemError;