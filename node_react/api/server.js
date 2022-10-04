require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

const validar = (req, res, next) => {
    console.log(req.headers);
    let token = req.headers["authorization"];
    if (!token) return res.status(401).json({ auth: false, msg: "Token não informado!" });
    token = token.replace("Bearer ", "");

    jwt.verify(token, process.env.SECRET, (err) => {
        if (err) {
            return res.status(401).json({ auth: false, msg: "Token inválido!" });
        }
        next();
    });
}


app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/login', (req, res) => {
    if (!req.body.usuario) {
        return res.status(401).json({ auth: false, msg: "Usuário não informado!" });
    }
    if (!req.body.senha) {
        return res.status(401).json({ auth: false, msg: "Senha não informada!" });
    }

    if ((req.body.usuario !== "lucas") ||
        (req.body.senha !== "123")) {
        return res.status(401).json({ auth: false, msg: "Usuário e/ou senha inválido(s)!" });
    }

    const token = jwt.sign(
        {
            usuario: req.body.usuario
        },
        process.env.SECRET,
        {
            expiresIn: "1d"
        });
    res.status(200).json({ auth: true, token });
});

app.get('/clientes', validar, (req, res) => {
    res.json({
        clientes: [
            { id: 1, nome: "lucas" },
            { id: 2, nome: "eliezer" },
            { id: 3, nome: "jeter" },
            { id: 4, nome: "thiago" },
            { id: 5, nome: "silvana" },
            { id: 6, nome: "rogerio" },
            { id: 7, nome: "braulio" },
            { id: 8, nome: "leandro" },
            { id: 9, nome: "luigui" }
        ]
    })
});

app.get("/personagens", (req, res) => {
    axios.get("https://thronesapi.com/api/v2/Characters")
        .then((response) => {
            return res.status(200).json(response.data);
        })
        .catch((error) => {
            return res.status(500).json({ error: true, msg: 'Erro interno!' })
        })
});

app.get("/personagens/:id", (req, res) => {
    axios.get(`https://thronesapi.com/api/v2/Characters/${req.params.id}`)
        .then((response) => {
            return res.status(200).json(response.data);
        })
        .catch((error) => {
            return res.status(500).json({ error: true, msg: 'Erro interno!' })
        })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});