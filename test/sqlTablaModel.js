const assert= require("assert")
const model= require("../index.js")


describe("Test de la clase sqlTablaModel",()=>
{
     it("verificacion de modelos",()=>
     {
        let test1=new model("test1",[
            {
                name:"id",
                type:"int",
                defaultNull:false,
                prymary:true,
            },
            {
                name:"row1",
                type:"text",
                defaultNull:false,
            }
        ])

        assert.equal(typeof test1.colum,"function","colum debe ser una funcion")
        assert.equal(typeof test1.foreingKey,"function","foreingKey debe ser una funcion")
        assert.equal(typeof test1.insert,"function","insert debe ser una funcion")
        
     })
    

})
