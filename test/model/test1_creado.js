/**
* tabla test1
* Sun Jan 20 2019 16:01:22 GMT-0400 (GMT-04:00)
*/
const tablaModel = require("tabla-model")
const test1=new tablaModel("test1",{
    colums:[
        {
            name:"id",
            type:"int"
            primary:true,
            autoincrement:true,
        },
        {
            name:"row1",
            type:"text"
        },
        {
            name:"row2",
            type:"int"
        },
        {
            name:"row3",
            type:"date"
        }
    ],
    foreingKey:[
        {
            key:"row2",
            reference:"test2"
            keyReference:"id_key2",
            onDelete:"NO ACTION",
            onUpdate:"CASCADE",
        }
    ]
})
test1.insert([1,"eever",34234,"23/10/95"])
module.exports = test1