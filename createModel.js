const fs = require("fs")
/**
* createModel
* Crea un archivo js apartir de un modelo  
*
*/
class createModel
{
    /**
    * @param {sqlTablaModel} model - modelo 
    */
    constructor(model)
    {
        this.model=model.getData()
    }
    /**
    * Crea el codigo javascript del modelo 
    * @return {string} - codigo javascritp 
    */
    js()
    {
        let js= `/**\n* tabla ${this.model.tabla}\n* ${new Date()}\n*/\n`
        js+="const tablaModel = require(\"tabla-model\")\n"
        js+=`const ${this.model.tabla}=new tablaModel("${this.model.tabla}",{\n`
        let colums= []
        for(let item of this.model.colums)
            colums.push(this.colum(item))
        js+="    colums:[\n        "+colums.join(",\n        ")+"\n    ],\n"
        if(this.model.foreingKey.length>0)
        {
            let keys= []
            for(let item of this.model.foreingKey)
                keys.push(this.foreingKey(item))   
            js+="    foreingKey:[\n        "+keys.join(",\n        ")+"\n    ]\n"
        }
        
        js+="})\n"
        if(this.model.init.length>0)
        {
            for(let i=0;i<this.model.init.length;i++)
            {
                js+=this.insert(this.model.init[i])+"\n"
            }
        }
        
        return js+`module.exports = ${this.model.tabla}`
    }
    /**
    * agrega datos para la inicializacion de el modelo 
    * @param {object|array} data
    * @return {string} - javacript 
    */
    insert(data)
    {
        let insert=[]  
        if(data instanceof Array)
        {
            for(let item in this.model.colums)
            {
                insert.push(data[item])
            }
        }else
        {
            for(let item of this.model.colums)
            {
                insert.push(data[item.name])
            }
        }                                
        let json=JSON.stringify(insert)
        return `${this.model.tabla}.insert(${json.slice(1,-1)})`
    }
    /**
    * crea el javascript para una columna del modelo 
    * @param {object} col - datos de la columna 
    * @return {string}
    */
    colum(col)
    {
        let ident="        "
        let ret = `{\n${ident}    name:"${col.name}",\n${ident}    type:"${col.type}"\n`
        if(col.primary)
            ret+=`${ident}    primary:true,\n`
        if(typeof col.defaultNull =="boolean")
            ret+=`${ident}    defaultNull:${col.defaultNull?"true":"false"},\n`
        if(col.unique)
            ret+=`${ident}    unique:true,\n`
        if(col.autoincrement)
            ret+=`${ident}    autoincrement:true,\n`
        if(col.defaul!=undefined)
            ret+=`${ident}    defaul:${col.defaul},\n`
        ret+=`${ident}}`
        return ret
    }
    /**
    * crea el javascript para una clave foranea 
    * @param {object} key - datos de la clave foranea
    */
    foreingKey(key)
    {
        let ident="        "
        let ret = `{\n${ident}    key:${JSON.stringify(key.key)},\n${ident}    reference:"${key.reference}"\n`
        ret+=`${ident}    keyReference:${JSON.stringify(key.keyReference)},\n`
        if(key.match!=undefined && key.match!='NONE')
            ret+=`${ident}    match:"${key.match}",\n`
        if(key.onDelete!=undefined && key.onDelete!='NO ACTION')
            ret+=`${ident}    onDelete:"${key.onDelete}",\n`
        if(key.onUpdate!=undefined && key.onUpdate!='NO ACTION')
            ret+=`${ident}    onUpdate:"${key.onUpdate}",\n`
        ret+=`${ident}}`
        return ret
    }
    /**
    * crea el modelo en el archivo file 
    * @param {string} file -  nombre del archivo 
    */
    save(file)
    {
        fs.writeFileSync(file,this.js())
    }
}
module.exports= createModel