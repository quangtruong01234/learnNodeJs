"use strict";
import mongoose from "mongoose";
import config from "../configs/config.mongodb";
const { db: { host, name, port } } = config;
const connectString = `mongodb://${host}:${port}/${name}`;
import {countConnect} from '../helpers/check.connect'
class Database {
  private static instance: Database;
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString,{
        maxPoolSize:50,
      })
      .then((_) => {
        
        console.log(`Connected Mongodb Pro`,countConnect())})
      .catch((err) => console.log("Error Connect!"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

export default instanceMongodb;
