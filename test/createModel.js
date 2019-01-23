const assert= require("assert")
const createModel= require("../createModel")
const Model= require("../index")
const path = require('path')
describe("Test de la clase createModel",()=>
{
    it('Verificacion de metodos',()=>
    {
        let create= new createModel(new Model('a',{}))
        assert.equal(typeof create.js,"function")
        assert.equal(typeof create.save,"function")
       
    })
    it('Metodo save',()=>
    {
        let create= new createModel(require('./model/test1.js'))
        create.save(path.dirname(__filename)+'/model/test1_creado.js')
    })
})