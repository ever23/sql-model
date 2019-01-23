const model2Sql = require("./model2Sql")
const sql2Model = require("./sql2Model")
const sqlHelpers = require("./sqlHelpers")
const createModel = require("./createModel")
/**
* sqlTablaModel
* modelo para las tablas sql
*/
class sqlTablaModel
{
    /**
    * @param {string} tableName - el nombre de la tabla o el sql para crear una tabla
    * @param {object|array|string} params - opcional si el primer parametro contiene el sql 
    * para crear una tabla este debe contener el caracter de escape y si solo contiene  
    * el nombre de una tabla este deberia contener el objeto o array con los datos de modelo 
    */
    constructor(tableName,params)
    {
        if(/^create[\s]+table/i.test(tableName))
        {
            let model=sql2Model(tableName,params)
            tableName=model.tabla
            params={
                colums:model.colums,
                foreignkeys:model.foreignkeys
            }
        }
        this.tabla=tableName
        /*
        {
            name:string,
            type:string,
            defaultNull:boolean,
            primary:boolean,
            unique:bolean,
            defaul:string,
            autoincrement:boolean
        }
        */
        let colums,foreingKey
        if(params instanceof Array)
        {
            colums=params
        }else {
            colums=params.colums
            foreingKey=params.foreingKey
        }

        this.__colums =colums || []
        /*
        {
            key:string|array,
            reference:string,
            keyReference:string|array,
            match:string,
            onDelete:string,
            onUpdate:string
        }
        */
        this.__foreingKey  = foreingKey||[]
        this.__init=[]
        this.__metods={}
    }
    /**
    * Agrega un metodo al modelo
    * @param {string} name - nombre del metodo a agregar
    * @param {function} callback - funcion tendra como primer parametro un objeto dbTabla
    */
    method(name,callback)
    {
        this.__metods[name]=callback
    }
    /**
    * retorna los datos del modelo
    * @return {object} tabla, colums, foreingKey
    */
    getData()
    {
        return {
            tabla:this.tabla,
            colums:this.__colums,
            foreingKey:this.__foreingKey,
            init:this.__init,
            methods:this.__metods
        }
    }
    /**
    * agrega una columna al modelo 
    * @param {object} coll - {name:string, type:string, efaultNull:boolean, primary:boolean, unique:bolean, defaul:string}
    */
    colum(coll)
    {
        this.__colums.push(coll)
    }
    /**
    * agrega una clave foranea al modelo 
    * @param {object} key - { key:string|array, reference:string, keyReference:string|array, match:string, onDelete:string, onUpdate:string}
    */
    foreingKey(key)
    {
        if(key===undefined)
            return this.__foreingKey
        this.__foreingKey.push(key)
    }
    /**
    * agrega lo datos de inicializacion del modelo 
    * @param {array} colums
    */
    insert(...params)
    {
       
        if(params instanceof Array && params.length==1)
        {
            this.__init.push(params[0])
        }else {
            this.__init.push(params)
        }
        
    }
   
    /**
    * retorna el sql nesesario para crear la tabla que el modelo representa 
    * @param {object} config - configuracion para el helperSql
    * @return {string}
    */
    sql(config)
    {
        return (new model2Sql(this,config)).sql()
    }
    /**
    * Guarda el modelos en un archiv javascript 
    * 
    */
    saveModel(file)
    {
        let creat= new createModel(this)
        create.save(file)
    }

}
sqlTablaModel.MYSQL_DB=sqlHelpers.MYSQL_DB
sqlTablaModel.POSTGRESQL_DB=sqlHelpers.POSTGRESQL_DB
sqlTablaModel.SQLITE3_DB=sqlHelpers.SQLITE3_DB
module.exports=sqlTablaModel
