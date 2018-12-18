const assert= require("assert")
const sql2Model= require("../sql2Model")
const {MYSQL_DB,POSTGRESQL_DB,SQLITE3_DB} = require("../sqlHelpers")
describe("Test de la clase sql2Model",()=>
{
    it("test sql",()=>
    {
        let sql="create table `test1`(`id` int not null,`row1` text default 'ever',`row2` int not null,`row3` text null,primary key (`id`),unique(`row2`),index(`row2`),FOREIGN KEY (`row2`) REFERENCES test2(`id`) )"
        let result={
            tabla:"test1",
            colums:[
                {
                    name:"id",
                    type:"int",
                    defaultNull:false,
                    primary:true,
                    unique:false,
                    defaul:""
                },
                {
                    name:"row1",
                    type:"text",
                    defaultNull:false,
                    primary:false,
                    unique:false,
                    defaul:"'ever'"
                },
                {
                    name:"row2",
                    type:"int",
                    defaultNull:false,
                    primary:false,
                    unique:true,
                    defaul:""
                }
                ,{
                    name:"row3",
                    type:"text",
                    defaultNull:true,
                    primary:false,
                    unique:false,
                    defaul:""
                }
            ],
            foreignkeys:[
                {
                    key:["row2"],
                    reference:"test2",
                    keyReference:["id"]
                }
            ]
        }
        assert.deepEqual(sql2Model(sql,"`"),result)
       
    })
    it("test sql2",()=>
    {
        let sql="create table `test1`(`id` int not null,`row1` text default 'ever',`row2` int not null,`row3` text null,primary key (`id`),unique(`row2`),index(`row2`),FOREIGN KEY (`row2`) REFERENCES test2(`id`) ON DELETE SET NULL ON UPDATE CASCADE MATCH FULL)"
        let result={
            tabla:"test1",
            colums:[
                {
                    name:"id",
                    type:"int",
                    defaultNull:false,
                    primary:true,
                    unique:false,
                    defaul:""
                },
                {
                    name:"row1",
                    type:"text",
                    defaultNull:false,
                    primary:false,
                    unique:false,
                    defaul:"'ever'"
                },
                {
                    name:"row2",
                    type:"int",
                    defaultNull:false,
                    primary:false,
                    unique:true,
                    defaul:""
                }
                ,{
                    name:"row3",
                    type:"text",
                    defaultNull:true,
                    primary:false,
                    unique:false,
                    defaul:""
                }
            ],
            foreignkeys:[
                {
                    key:["row2"],
                    reference:"test2",
                    keyReference:["id"],
                    onDelete:"SET NULL",
                    onUpdate:"CASCADE",
                    match:"FULL"
                }
            ]
        }
        assert.deepEqual(sql2Model(sql,"`"),result)
       
    })
   
})
