const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({ // tratamento dos dados de como vai ser salvo no MongoDB
    titulo: { type: String, required: true }, // ele é do tipo String e é necessário ser preenchido
    descricao: String
});

const HomeModel = mongoose.model('Home', HomeSchema) // Para criar o model

class Home {

};

module.exports = Home;