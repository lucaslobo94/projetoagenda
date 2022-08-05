require('dotenv').config(); // serve para guardar os dados que não deseja ser exibido (senhas)
const express = require('express');
const app = express();

const mongoose = require('mongoose'); // para parametrizar o jeito que vai ser salvo no MongoDB
mongoose.connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }).then(() => {
        app.emit('Conectado.'); // vai transmitir um sinal que está pronto
    })
    .catch(e => console.log(e));

const session = require('express-session'); // para salvar o cookie com os dados de login do cliente para quando logar novamente, ele vai conectar direto
const MongoStore = require('connect-mongo'); // as sessões vão ser salvar no banco
const flash = require('connect-flash'); // msg auto destrutivas, assim que ler elas somem ( msg de erro)
const path = require('path'); // trabalhar com caminhos
//const helmet = require('helmet'); // recomendação do express para segurança
const csrf = require('csurf'); // CSRF token criado para os formularios, não permite invasao de sites externos
const routes = require('./routes'); // rotas da aplicação /home /contato
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware'); // Middlewares - funções que são executadas na rota

//app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: true })); // pode postar formularios pra dentro da aplicação
app.use(express.json()); // 
app.use(express.static(path.resolve(__dirname, 'public'))); // pasta para conteudo estático

const sessionOptions = session({ // configuração de sessão
    secret: ';2-3o2032-[3o20-3;o02-',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views')); // são os arquivos que renderiza na tela ( HTML)
app.set('view engine', 'ejs') // qual a view engine vai usar ( no caso EJS)

app.use(csrf());
app.use(middlewareGlobal); // todas as rotas vai passar pelo middleware
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('Conectado.', () => {
    app.listen(3000, () => { // para o Express escutar a porta que informar 
        console.log('Acessar http://localhost:3000');
        console.log('Servidor inciado.');
    });
});