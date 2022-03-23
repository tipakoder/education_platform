const references = require("./index");
const {Schema, model} = require("mongoose");

const AccountSchema = new Schema(
    {
        roleId: { type: Schema.Types.ObjectId, ref: references.role, required: true },
        classId: { type: Schema.Types.ObjectId, ref: references.class },
        login: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        fullname: {
            name: { type: String, required: true },
            surname: { type: String, required: true },
            patronymic: { type: String, required: true }
        },
        email: { type: String, required: true },
        coins: { type: Number, default: 0 },
        socialCoins: { type: Number, default: 0 }
    }
);

module.exports = model(references.account, AccountSchema);