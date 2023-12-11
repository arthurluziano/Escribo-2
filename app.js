/* eslint-disable indent */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/", (req, res) => {
    res.status(200).json({ msg: "Bem vindo a nossa API." });
});

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
    // eslint-disable-next-line quotes
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.w4y8lsa.mongodb.net/`)
    .then(() => {
        app.listen(3000);
        console.log("Conexão bem-sucedida!");
    })
    .catch((err) => console.log(err));
