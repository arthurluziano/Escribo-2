/* eslint-disable indent */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// Configurar o Express para leitura de Json.
app.use(express.json());

// Models
const User = require("./models/User");

// Rota pública.
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Bem vindo a nossa API." });
});

// Registro de Usuários.
app.post("/auth/register", async (req, res) => {

    const { name, email, password, confirmpassword, telephone } = req.body;

    // Validações.
    if (!name) {
        return res.status(422).json({ msg: "O nome é obrigatório!" });
    }

    if (!email) {
        return res.status(422).json({ msg: "O email é obrigatório!" });
    }

    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória!" });
    }

    if (!telephone) {
        return res.status(422).json({ msg: "Por favor, insira um telefone!" });
    }

    if (password !== confirmpassword) {
        return res.status(422).json({ msg: "As senhas não conferem!" });
    }

    // Confirmação de existência do Usuário.
    const userExists = await User.findOne({ email: email });

    if (userExists) {
        return res.status(422).json({ msg: "Por favor, utilize outro email!" });
    }

    // Criação da senha.
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Criação do usuário.
    const user = new User({
        name,
        email,
        password,
        telephone,
    });
});

// Credenciais.
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
