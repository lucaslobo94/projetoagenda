const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({ // tratamento dos dados de como vai ser salvo no MongoDB
    nome: { type: String, required: true }, // ele é do tipo String e é necessário ser preenchido
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now }
});

const ContatoModel = mongoose.model('Contato', ContatoSchema) // Para criar o model

function Contato(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
}

Contato.prototype.register = async function () {
    this.valida();
    if (this.errors.length > 0) return;
    this.contato = await ContatoModel.create(this.body);

}

Contato.prototype.valida = function () {
    this.cleanUp();
    // Validação dos campos digitados
    // -> E-mail precisa ser valido
    
    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
    if (!this.body.nome) this.errors.push('Nome é um campo obrigatório.');
    if (!this.body.email && !this.body.telefone) {
        this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone.');
    }
};

Contato.prototype.cleanUp = function () { // garantir que tudo seja uma string dentro do body
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') { // se não for uma string, vai converter pra vazio
            this.body[key] = ''
        }
    };

    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
    }
}

Contato.prototype.edit = async function (id) {
    if (typeof id !== 'string') return;
    this.valida();
    if (this.errors.length > 0) return;
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });

}

// Métodos estáticos
Contato.buscaPorId = async function (id) {
    if (typeof id !== 'string') return; // verifica se é uma string
    const contato = await ContatoModel.findById(id);
    return contato;
}

Contato.buscaContatos = async function () {
    const contatos = await ContatoModel.find()
        .sort({ criadoEm: -1 });
    return contatos;
}

Contato.delete = async function (id) {
    if (typeof id !== 'string') return;

    const contato = await ContatoModel.findOneAndDelete({_id: id});
    return contato;
}

module.exports = Contato