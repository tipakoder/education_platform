const bcrypt = require("bcrypt");
const Logger = require("../../utils/Logger");

const RoleModel = require("./models/Role");
const AccountModel = require("./models/Account");

/**
 * Insert dataset of type model
 * @param {Model} model 
 * @param {Array|any} rowFilter 
 * @param {Array} dataset 
 * @returns 
 */
const insertDataset = async(model, rowFilter, dataset = []) => {
    if (dataset === []) {
        Logger.info([Logger.getColors().cyan(`[${model.collection.name}]`), `dataset is empty`]);
        return;
    }

    Logger.info([Logger.getColors().cyan(`[${model.collection.name}]`), `inserting dataset to database`]);

    // Insert each row
    let resultRows = [];
    for (const row of dataset) {
        // Set find filter
        const filter = {};
        if (!Array.isArray(rowFilter)) {
            filter[rowFilter] = row[rowFilter];
        } else {
            for (let rowName of rowFilter) {
                filter[rowName] = row[rowName];
            }
        }

        // Find or create row
        let resultRow;
        if (!(resultRow = await model.findOne(filter))) {
            resultRow = await model.create(row);
        }
        
        // Push row to result list
        resultRows.push(resultRow);
    }

    return resultRows;
}

/**
 * Insert presets
 */
module.exports = async() => {
    // Insert standart roles
    const finalRoles = await insertDataset(
        RoleModel,
        "name",
        [
            {
                name: "user",
                permissions: {
                    student: true
                }
            },
            {
                name: "teacher",
                permissions: {
                    student: true,
                    teacher: true
                }
            },
            {
                name: "admin",
                permissions: {
                    admin: true
                }
            },
            {
                name: "root",
                permissions: {
                    teacher: true,
                    admin: true,
                    root: true
                }
            }
        ]
    );

    // Insert standart accounts
    const finalAccounts = await insertDataset(
        AccountModel,
        [
            "login",
            "email"
        ],
        [
            {
                roleId: finalRoles[3]._id,
                login: "python",
                passwordHash: bcrypt.hashSync("python", 2),
                fullname: {
                    name: "Дмитрий",
                    surname: "Донсков",
                    patronymic: "Питонович",
                },
                email: "admin@forum.com"
            }
        ]
    );
}