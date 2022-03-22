/**
 * Custom error
 * With new buns
 */
class CustomError extends Error {
    /**
     * Error content
     */
    #content = "";

    /**
     * Constructor
     * @param {any} content 
     */
    constructor (content) {
        super(content);

        if (typeof content === "string") {
            this.#content = content;
        } else { 
            this.#content = content.toString();
        }
    }

    /**
     * Get error stack
     */
    getStack() {
        return this.stack;
    }

    /**
     * Convert error to JS object
     * @returns {object}
     */
    toObject () {
        return {
            content: this.#content
        }
    }

    /**
     * Convert error to json
     * @returns {string}
     */
    toJSON () {
        return JSON.stringify(this.toObject());
    }
}

module.exports = CustomError;