"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminjs_1 = require("adminjs");
const resource_1 = __importDefault(require("./resource"));
class Database extends adminjs_1.BaseDatabase {
    constructor(database) {
        super(database);
        this.sequelize = database.sequelize || database;
    }
    static isAdapterFor(database) {
        return (database.sequelize
            && database.sequelize.constructor.name === 'Sequelize')
            || database.constructor.name === 'Sequelize';
    }
    resources() {
        return Object.keys(this.sequelize.models).map((key) => (new resource_1.default(this.sequelize.models[key])));
    }
}
exports.default = Database;
