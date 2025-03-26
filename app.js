// Importa o módulo para o projeto
const express = require('express')
const path = require('path')
const mysql = require('mysql2/promise')

// Configura o express para ser usado
const App = express()
App.set("view engine", "ejs")
App.set("views", path.join(__dirname, "mvc/views"))
App.use(express.static(path.join(__dirname, "public")))
App.use(express.urlencoded({extended: true}))
App.use(express.json())

const connection = mysql.createPool({
    host: '10.111.4.30',
    user: 'dev1b',
    database: 'dev1b',
    password: 'Sen4i2024'
})

// Endpoint
App.get("/",  (req,res) => {

    res.render("index.ejs", {
        invalido: "",
        senhaInvalida: "",
        usuarioInvalido: ""

    }
)
})

App.post('/login', async (req,res) => {
    
    let usuario = ''
    let senha = ''

    usuario = req.body.usuario
    senha = req.body.senha

    // Mensagens de erro
    const invalido = "Preencha os campos corretamente"
    const senhaInvalida = "Senha invalida"
    const usuarioInvalido = "Usuário invalido"

    // Verificando se o campo está preenchido
    if(req.body.usuario === '' || req.body.senha === '')
    {
        return res.render("index.ejs", {
            invalido: invalido,
            senhaInvalida: "",
            usuarioInvalido: ""
        });
    }
    //Fim da verificação

    const sql = "SELECT * FROM kgd_usuarios WHERE usuario = ?"

    const [rows] = await connection.execute(sql, [usuario])

    // Verifcando se o usuário existe
    if(rows.length === 0) {
            return res.render("index.ejs", {
            invalido: "",
            senhaInvalida: "",
            usuarioInvalido: usuarioInvalido
        })
    }

    // Comparação da senha fornecida com a senha armazenada no banco de dados
    if (senha !== rows[0].senha) {
        return res.render("index.ejs", {
            invalido: "",
            senhaInvalida: senhaInvalida,
            usuarioInvalido: ""
        })
    }

    // Redireciona para a página após o login bem-sucedido
    res.redirect("/page")

})

// Rota para a página após login bem-sucedido
App.get("/page", (req, res) => {
    res.render("page.ejs")
})

// Criação do servidor
App.listen(3000, () => console.log('Servidor Online!'))
