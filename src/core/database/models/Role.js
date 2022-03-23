const references = require("./index");
const {Schema, model} = require("mongoose");

const RoleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        permissions: {
            student: {
                type: Boolean,
                default: false
            },
            teacher: {
                type: Boolean,
                default: false
            },
            admin: {
                type: Boolean,
                default: false
            },
            root: {
                type: Boolean,
                default: false
            }
        }
    }
);

module.exports = model(references.role, RoleSchema);