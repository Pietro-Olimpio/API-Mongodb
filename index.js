//importando as bibliotecas
const express = require('express');
const {MongoClient,ObjectId} = require('mongodb');

//usa a biblioteca express
const app = express();
app.use(express.json());

//conectando ao Cluster
const client = new MongoClient(process.env.MONGO_URI);

//conectando ao banco e a coleção especifica
const produtos = client.db('loja').collection('produtos');

//Criando o metodo HTTP
//metodo post para add um novo produto
app.post('/produtos',async (req,res)=>{
    const novo_produto = await produtos.insertOne(req.body);
    res.status(201).json(novo_produto);
});
//metodo get para visualizar todos os produtos
app.get('/produtos',async (req,res)=> {
    const lista = await produtos.find().toArray();
    res.json(lista);
});
//metodo get para vizualizar um produto especifico
app.get('/produtos/:id',async (req,res)=> {
    const resultado = await produtos.findOne({_id:new ObjectId(req.params.id)});
    res.json(resultado)
});

//metodo para atualizar algum produto especifico
app.put('/produtos/:id', async (req,res)=>{
    const resultado = await produtos.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body});
    res.json(resultado);
});

//metodo delete para deletar produtos especifico
app.delete('/produtos/:id', async (req,res)=> {
    const resultado = await produtos.deleteOne({_id:new ObjectId(req.params.id)});
    res.json(resultado);
});

//Iniciando o servidor 

client.connect()
    .then(()=>{
        console.log('Conectado ao MONGODB');
        app.listen(3000,()=>console.log('API rodando na porta 3000'));
    })
    .catch((erro)=>console.log('Erro ao conecar',erro.message));