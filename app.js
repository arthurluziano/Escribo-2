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

// Rota privada.
app.get("/user/:id", checkToken, async (req, res) => {

    const id = req.params.id;

    // Confirmação de existência do Usuário.
    const user = await User.findById(id, "-password");

    // Validações.
    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    res.status(200).json({ user });

});

// Checagem de acesso somente se o Token for válido.
function checkToken(req, res, next) {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Acesso negado!" });
    }

    try {

        const secret = process.env.SECRET;

        jwt.verify(token, secret);

        next();

    } catch (error) {

        res.status(400).json({ msg: "Token invalido!" });

    }

}

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
        password: passwordHash,
        telephone,
    });

    try {

        await user.save();

        res.status(201).json({ msg: "Usuário criado com sucesso!" });

    } catch (error) {
        console.log(error);

        res
            .status(500)
            .json({ msg: "Tivemos um problema no servidor, tente novamente mais tarde!" });
    }
});

// Login de Usuários.
app.post("/auth/login", async (req, res) => {

    const { email, password } = req.body;

    // Validações.
    if (!email) {
        return res.status(422).json({ msg: "O email é obrigatório!" });
    }

    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória!" });
    }

    // Confirmação de existência do Usuário.
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    // Confirmação da senha utilizada.
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return res.status(422).json({ msg: "Senha inválida!" });
    }

    try {

        const secret = process.env.SECRET;

        const token = jwt.sign({
            id: user._id
        }, secret,
        );

        res.status(200).json({ msg: "Autenticação realizada com sucesso", token });

    } catch (err) {
        console.log(err);

        res
            .status(500)
            .json({ msg: "Tivemos um problema no servidor, tente novamente mais tarde!" });
    }

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
