const sqlHelpers=require("./sqlHelpers")

/**
* model2Sql
* convierte un objeto de modelo en sql nesesario para crear la tabla que representa 
*
*/
class model2Sql
{
    /**
    * @param {dbTablaModel} model - modelo a convertir 
    * @param {object} helper - configuraciones para el helper 
    */
    constructor(model,helper)
    {
        this.__model=model
        this.__helpers=new sqlHelpers(helper)
        this.__typeDB=helper.typeDB
    }
    /**
    * crea una columna en sql 
    * @param {object} colum - {name:string, type:string, efaultNull:boolean, primary:boolean, unique:bolean, defaul:string}
    * @return {string}
    */
    __colums(colum)
    {
        if(this.__typeDB===sqlHelpers.POSTGRESQL_DB && colum.autoincrement)
        {
            colum.type="serial"
        }
        let sql =`${this.__helpers.protectIdentifiers(colum.name)} ${colum.type}`
        if(colum.defaultNull!==undefined)
            if(colum.defaultNull)
            {
                sql+=" NULL"
            }else {
                sql+=" NOT NULL"
            }
        if(colum.primary && !colum.defaultNull)
        {
            sql+=" NOT NULL"
        }
        if(colum.default!==undefined)
        {
            sql+=` DEFAULT ${colum.default}`
        }
        if(colum.autoincrement && this.__typeDB===sqlHelpers.MYSQL_DB)
        {
            sql+=" AUTO_INCREMENT"
        }
        return sql
    }
    /**
    * crea las claves primarias en sql 
    * @params {array} keys - nombre de las claves primarias 
    * @return {string}
    */
    __primaryKeys(keys)
    {
        let colums=this.__helpers.protectIdentifiers(keys).join(",")
        return `PRIMARY KEY (${colums})`
    }
    /**
    * crea las claves unicas en sql 
    * @params {array} keys - nombre de las claves unicas 
    * @return {string}
    */
    __uniqueKeys(keys)
    {
        let colums=this.__helpers.protectIdentifiers(keys).join(",")
        return `UNIQUE (${colums})`
    }
    /**
    * crea los indices en sql 
    * @params {array} keys - nombre de los indices
    * @return {string}
    */
    __indexKey(keys)
    {
        let colums=this.__helpers.protectIdentifiers(keys).join(",")
        return `INDEX (${colums})`
    }
    /**
    * crea una clave foranea en sql 
    * @param {string} tabla - nombre de la tabla 
    * @param {object} keys - clave foranea { key:string|array, reference:string, keyReference:string|array, match:string, onDelete:string, onUpdate:string}
    * @return {string}
    */
    __foreingKey(tabla,keys,numero)
    {
        let keyReference="",key=""
        if(keys.keyReference instanceof Array)
        {
            keyReference=this.__helpers.protectIdentifiers(keys.keyReference).join(",")
        }else {
            keyReference=this.__helpers.protectIdentifiers(keys.keyReference)
        }
        if(keys.key instanceof Array)
        {
            key=this.__helpers.protectIdentifiers(keys.key).join(",")
        }else {
            key=this.__helpers.protectIdentifiers(keys.key)
        }
        let constrait=this.__helpers.protectIdentifiers(`m2s_${tabla}_${keys.reference}_${numero}`)
        let sql=`CONSTRAINT ${constrait} FOREIGN KEY (${key}) REFERENCES ${this.__helpers.protectIdentifiers(keys.reference)} (${keyReference})`
        if(keys.match!==undefined)
        {
            sql+=` MATCH ${keys.match}`
        }
        if(keys.onUpdate!==undefined)
        {
            sql+=` ON UPDATE ${keys.onUpdate}`
        }
        if(keys.onDelete!==undefined)
        {
            sql+=` ON DELETE ${keys.onDelete}`
        }
        return sql
    }
    /**
    * crea el sql nesesario para crea una tabla 
    * @param {object} data - {tabla:string, colums:array, foreingKey:array}
    * @return {string}
    */
    __cerateTable(data)
    {

        let colums= [],
            primary   = [],
            unique    = [],
            index     = []

        for(let colum of data.colums)
        {
            colums.push(this.__colums(colum))
            if(colum.primary!==undefined && colum.primary)
                primary.push(colum.name)
            if(colum.unique!==undefined && colum.unique)
                unique.push(colum.name)
        }

        if(primary.length>0)
        {
            colums.push(this.__primaryKeys(primary))
        }
        if(unique.length>0)
        {
            colums.push(this.__uniqueKeys(unique))
        }
        if(this.__typeDB===sqlHelpers.MYSQL_DB)
        {
            for(let keys of data.foreingKey)
            {
                if(keys.key instanceof Array)
                {
                    for(let i of keys.key)
                        index.push(i)
                }else {
                    index.push(keys.key)
                }
            }

            if(index.length>0)
                colums.push(this.__indexKey(index))
        }

        let i=1
        for(let keys of data.foreingKey)
            colums.push(this.__foreingKey(data.tabla,keys,i++))
        return `CREATE TABLE ${this.__helpers.protectIdentifiers(data.tabla)} (${colums.join(",")});`
    }
    /**
    * crea el sql nesesario para crea la tabla asociada al modelo pasado al constructor 
    * 
    * @return {string}
    */
    sql()
    {
        return this.__cerateTable(this.__model.getData())
    }
}

module.exports=model2Sql
