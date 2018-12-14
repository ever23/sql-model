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
    /*it("metodo keys",()=>
    {
        let test1=new model("test1",[
            {
                name:"id",
                type:"int",
                autoincrement:true,
                primary:true,
            },
            {
                name:"row1",
                type:"text",
                defaultNull:false,
            }
        ])
        assert.deepEqual(test1.keys(),{
            colum:{
                id:{
                    Type:"int",
                    TypeName : "",
                    KEY : "",
                    Extra :"",
                    Default :  "",
                    Nullable : false,
                    Position : "0"
                },
                row1:{
                    Type:"text",
                    TypeName : "",
                    KEY : "",
                    Extra :"",
                    Default :  "",
                    Nullable : false,
                    Position : "1"
                }
            },
            primary:["id"],
            autoincrement:"id",
            OrderColum:{"0":"id","1":"row1"}

        })


    })*/

})
