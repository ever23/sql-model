const assert= require("assert")
const model2Sql= require("../model2Sql")

const {MYSQL_DB,POSTGRESQL_DB,SQLITE3_DB} = require("../sqlHelpers")
describe("Test de la clase model2Sql",()=>
{

    it("verificacion de metodos",()=>
    {
        let config={
            escapeChar:"`",
            escapeString:e=>e
        }
        let sql=new model2Sql(require("./model/test1"),config)
        assert.equal(typeof sql.__colums,"function")
        assert.equal(typeof sql.__primaryKeys,"function")
        assert.equal(typeof sql.__uniqueKeys,"function")
        assert.equal(typeof sql.__foreingKey,"function")
        assert.equal(typeof sql.__cerateTable,"function")
        assert.equal(typeof sql.sql,"function")
    })
    it("metodo __colums",()=>
    {
        let config={
            escapeChar:"`",
            escapeString:e=>e
        }
        let sql=new model2Sql(require("./model/test1"),config)
        assert.equal(sql.__colums({
            name:"id",
            type:"int",
            default:1,
        }),"`id` int DEFAULT 1")
    })
    it("metodo __colums MYSQL_DB",()=>
    {
        let config={
            escapeChar:"`",
            escapeString:e=>e,
            typeDB:MYSQL_DB
        }
        let sql=new model2Sql(require("./model/test1"),config)
        assert.equal(sql.__colums({
            name:"id",
            type:"int",
            defaultNull:false,
            autoincrement:true
        }),"`id` int NOT NULL AUTO_INCREMENT")

    })
    it("metodo __colums SQLITE3_DB",()=>
    {
       let config={
           escapeChar:"",
           escapeString:e=>e,
           typeDB:SQLITE3_DB
       }
        let sql=new model2Sql(require("./model/test1"),config)
        assert.equal(sql.__colums({
            name:"id",
            type:"int",
            defaultNull:false,
            autoincrement:true
        }),"id int NOT NULL")
    })
    it("metodo __colums POSTGRESQL_DB",()=>
    {
        let config={
            escapeChar:"\"",
            escapeString:e=>e,
            typeDB:POSTGRESQL_DB
        }
        let sql=new model2Sql(require("./model/test1"),config)
        assert.equal(sql.__colums({
            name:"id",
            type:"int",
            defaultNull:false,
            autoincrement:true
        }),"\"id\" serial NOT NULL")
    })
    it("metodo __primaryKeys",()=>
    {
        let config={
            escapeChar:"`",
            escapeString:e=>e
        }
        let sql=new model2Sql(require("./model/test1"),config)
        assert.equal(sql.__primaryKeys(['id']),"PRIMARY KEY (`id`)")
        assert.equal(sql.__primaryKeys(['id','row1']),"PRIMARY KEY (`id`,`row1`)")

    })
    it("metodo __uniqueKeys",()=>
    {
        let config={
            escapeChar:"`",
            escapeString:e=>e
        }
        let sql=new model2Sql(require("./model/test1"),config)
        assert.equal(sql.__uniqueKeys(['id']),"UNIQUE (`id`)")
        assert.equal(sql.__uniqueKeys(['id','row1']),"UNIQUE (`id`,`row1`)")

    })
    it("metodo __indexKey",()=>
    {
        let config={
            escapeChar:"`",
            escapeString:e=>e
        }
        let sql=new model2Sql(require("./model/test1"),config)
        assert.equal(sql.__indexKey(['id']),"INDEX (`id`)")
        assert.equal(sql.__indexKey(['id','row1']),"INDEX (`id`,`row1`)")

    })
    it("metodo __foreingKey",()=>
    {
        let config={
            escapeChar:"`",
            escapeString:e=>e
        }
        let sql=new model2Sql(require("./model/test1"),config)
        assert.equal(sql.__foreingKey("test1",{
            key:"row2",
            reference:"test2",
            keyReference:"id_key2",
            onUpdate:'CASCADE',
            onDelete:'NO ACTION'
        },1),"CONSTRAINT `m2s_test1_test2_1` FOREIGN KEY (`row2`) REFERENCES "+
        "`test2` (`id_key2`) ON UPDATE CASCADE ON DELETE NO ACTION")
         assert.equal(sql.__foreingKey("test1",{
             key:["row1","row2"],
             reference:"test2",
             keyReference:["id_key1","id_key2"],

             onDelete:'NO ACTION'
         },1),"CONSTRAINT `m2s_test1_test2_1` FOREIGN KEY (`row1`,`row2`) REFERENCES "+
         "`test2` (`id_key1`,`id_key2`) ON DELETE NO ACTION")
       // assert.equal(sql.__uniqueKeys(['id','row1']),"UNIQUE (`id`,`row1`)")
    })
    it("metodo __cerateTable POSTGRESQL_DB",()=>
    {
        let config={
            escapeChar:"\"",
            escapeString:e=>e,
            typeDB:POSTGRESQL_DB
        }
        let table={
            tabla:'test1',
            colums:[
                {
                    name:"id",
                    type:"int",
                    primary:true,
                    autoincrement:true
                },
                {
                    name:"row1",
                    type:"VARCHAR(1)",
                    defaultNull:true
                }
            ],
            foreingKey:[
                {
                    key:"row1",
                    reference:"test2",
                    keyReference:"id_key2",
                    onUpdate:'CASCADE',
                    onDelete:'NO ACTION'
                }
            ]
        }

        let result_pg="CREATE TABLE \"test1\" (\"id\" serial NOT NULL,"
        +"\"row1\" VARCHAR(1) NULL,"
        +"PRIMARY KEY (\"id\"),"
        +"CONSTRAINT \"m2s_test1_test2_1\" FOREIGN KEY (\"row1\") REFERENCES "
        +"\"test2\" (\"id_key2\") ON UPDATE CASCADE ON DELETE NO ACTION);"
        assert.equal((new model2Sql(require("./model/test1"),config)).__cerateTable(table),result_pg,"error en postgre")
    })
    it("metodo __cerateTable MYSQL_DB",()=>
    {
        //let sql=
        let table={
            tabla:'test1',
            colums:[
                {
                    name:"id",
                    type:"int",
                    primary:true,
                    autoincrement:true
                },
                {
                    name:"row1",
                    type:"VARCHAR(1)",
                    defaultNull:true
                }
            ],
            foreingKey:[
                {
                    key:"row1",
                    reference:"test2",
                    keyReference:"id_key2",
                    onUpdate:'CASCADE',
                    onDelete:'NO ACTION'
                }
            ]
        }
        let config={
            escapeChar:"`",
            escapeString:e=>e,
            typeDB:MYSQL_DB
        }
        let result_mysql="CREATE TABLE `test1` (`id` int NOT NULL AUTO_INCREMENT,"
        +"`row1` VARCHAR(1) NULL,"
        +"PRIMARY KEY (`id`),"
        +"INDEX (`row1`),"
        +"CONSTRAINT `m2s_test1_test2_1` FOREIGN KEY (`row1`) REFERENCES "
        +"`test2` (`id_key2`) ON UPDATE CASCADE ON DELETE NO ACTION);"
        assert.equal((new model2Sql(require("./model/test1"),config)).__cerateTable(table),result_mysql,"error en mysql")
    })
    it("metodo __cerateTable SQLITE3_DB",()=>
    {
        //let sql=
        let table={
            tabla:'test1',
            colums:[
                {
                    name:"id",
                    type:"int",
                    primary:true,
                    autoincrement:true
                },
                {
                    name:"row1",
                    type:"VARCHAR(1)",
                    defaultNull:true
                }
            ],
            foreingKey:[
                {
                    key:"row1",
                    reference:"test2",
                    keyReference:"id_key2",
                    onUpdate:'CASCADE',
                    onDelete:'NO ACTION'
                }
            ]
        }
        let config={
            escapeChar:"",
            escapeString:e=>e,
            typeDB:SQLITE3_DB
        }
        let result_sqlite="CREATE TABLE test1 (id int NOT NULL,"
        +"row1 VARCHAR(1) NULL,"
        +"PRIMARY KEY (id),"
        +"CONSTRAINT m2s_test1_test2_1 FOREIGN KEY (row1) REFERENCES "
        +"test2 (id_key2) ON UPDATE CASCADE ON DELETE NO ACTION);"
        assert.equal((new model2Sql(require("./model/test1"),config)).__cerateTable(table),result_sqlite,"error en sqlite")




    })
    it("metodo __cerateTable",()=>
    {
        let config={
            escapeChar:"`",
            escapeString:e=>e,
            typeDB:MYSQL_DB
        }
        let sql=new model2Sql(require("./model/test1"),config)

        let result="CREATE TABLE `test1` (`id` int NOT NULL AUTO_INCREMENT,"
        +"`row1` text,"
        +"`row2` int,"
        +"`row3` date,"
        +"PRIMARY KEY (`id`),"
         +"INDEX (`row2`),"
        +"CONSTRAINT `m2s_test1_test2_1` FOREIGN KEY (`row2`) REFERENCES "
        +"`test2` (`id_key2`) ON UPDATE CASCADE ON DELETE NO ACTION);"
        assert.equal(sql.sql(),result)

    })
})
