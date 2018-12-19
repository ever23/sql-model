const sqlString=require("sqlstring")
function escapeDefault(text)
{
    let result=sqlString.escape(text)
    if(/^'.*'$/.test(result))
    {
        return result.slice(1,-1)
    }
    return result
}
/**
* sqlHelpers
* helpers para el tratamiento de texto sql
*/
class  sqlHelpers
{
    /**
    * @param {object} escapeChar, reserveIdentifiers, ar_aliased_tables, dbprefix, escapeString
    */
    constructor(config)
    {
        this.__escapeChar=config.escapeChar||""
        this.__reserveIdentifiers=config.reserveIdentifiers||["*"]
        this.__ar_aliased_tables=config.ar_aliased_tables||[]
        this.__dbprefix=config.dbprefix||""
        this.__swap_pre=config.ar_aliased_tables||""

        this.__escapeString=typeof config.escapeString==="function"?config.escapeString:s=>escapeDefault(s)
    }
    /**
    * convierte un objeto en expreciones booleana sql de igualdad
    * si el nombre de un atributo comienza por ||usara operado OR con
    * el siguiente atributo por defecto usa el operado AND
    * @param {object} valores
    * @return {string}
    */
    __object2boleandSql(valores)
    {
        let text = ""
        let operator=""
        let j=0
        for(let i in valores)
        {
            if(j++!==0)
            {
                operator=/^(\|\|)/.test(i)?"OR":"AND"
                text+=` ${operator} `//+ ' and '
            }
            let identifier=i.replace(/^(&&|\|\|)/,"").replace(/(=|\<|\>|\<\=|\>\=|\!\=|%|\!)$/,"")
            let Regcomparation=/(=|\<|\>|\<\=|\>\=|\!=|%|\!)$/.exec(i)
            let comparation="="
            if(Regcomparation instanceof Array && typeof Regcomparation[0]!=undefined)
            {
                 comparation=Regcomparation[0]==="%"?" LIKE ":Regcomparation[0]
                 comparation=comparation==="!"?"!=":comparation
            }

            if(valores[i] instanceof Array)
            {
                let v=[]
                
                for(let a in valores[i])
                {
                    let value=this.__formatVarInsert(valores[i][a])
                    let comparation2=comparation
                    if(value==='NULL')
                    {
                        if(comparation2=="=")
                        {
                             comparation2=" IS "
                        }else if(comparation2=="!=")
                        {
                            comparation2=" IS NOT "
                        }
                    }
                    v.push(this.__protectIdentifiers(identifier) + comparation2 + value)
                }
                text+=`(${v.join(" OR ")})`
            }else {
                let value=this.__formatVarInsert(valores[i])
                if(value==='NULL')
                {
                    if(comparation=="=")
                    {
                         comparation=" IS "
                    }else if(comparation=="!=")
                    {
                        comparation=" IS NOT "
                    }
                }
                text+= this.__protectIdentifiers(identifier) + comparation + value
            }

        }
        //console.log(text)
        return text
    }
    /**
    * proteje identificadores en una exprecion boleana
    * @param {string} text - exprecion boleana sqlite
    * @return {string}
    */
    __protectIdentifiersBolean(text)
    {
        let regx=/((?!["'`])([\w]+)(?!["'`]) *(!=|>=|<=|=|>|<) *)|((?!["'`])([\w]+)(\.)([\w]+)(?!["'`])? *(!=|>=|<=|=|>|<) *)/g

        let char=this.__escapeChar
        let replace=(str,$1,$2,$3,$4,$5,$6,$7,$8)=>
        {
            //let result=""
            if($6===".")
            {
                if(/^[\d]+(\.[\d]+)?(e\+?[\d]+)?$/i.test($5))
                {
                    return `${$5}${$6}${$7}${$8}`
                }else {
                    return `${char}${$5}${char}${$6}${char}${$7}${char}${$8}`
                }
            }
            return `${char}${$2}${char}${$3}`
        }
        return text.replace(regx,replace)
    }
    /**
    * filtra inyecciones de sql usando la funcion escapeString pasada en la
    * configuracion del constructor
    * @param {string|array}
    * @return {string}
    */
    filterSqlI(sql,exept=[])
    {
        if (typeof sql ==="undefined")
        {
            return sql
        } else if ( sql instanceof Array)
        {
            for(let i in sql)
            {
                sql[i]=exept.find(e=>{return e===i})===undefined?this.filterSqlI(sql[i]):sql[i]
            }

            return sql
        } else
        {

            return this.__escapeString(sql)
        }
    }
    /**
    * escapa lo identificadores sql usando el caracter de escape
    * pasado el atributo escapeChar de la configuracion del constructor
    * @param {string} item
    * @return {string}
    */
    __escapeIdentifiers(item)
    {
        let str

        if (this.__escapeChar === "")
        {
            return item
        }
        for(let id of this.__reserveIdentifiers)
        {
            if (item.indexOf("."+id) !== -1)
            {
                str=this.__escapeChar+item.replace(/\./g,this.__escapeChar+".")
                return str.replace(new RegExp("[" + this.__escapeChar + "]+","g"),this.__escapeChar)
            }
        }

        if(item.indexOf(".")!==-1)
        {
            //console.log(item.replace('.',this.__escapeChar+'.'+this.__escapeChar))
            str=this.__escapeChar+item.replace(/\./g,this.__escapeChar+"."+this.__escapeChar)+this.__escapeChar
        }else {
            str=this.__escapeChar+item+this.__escapeChar
        }

        return str.replace(new RegExp("[" + this.__escapeChar + "]+","g"),this.__escapeChar)

    }
    /**
    * protege los identificadores sql
    * @param {string|object} item
    * @param {boolean} prefix_single
    * @param {boolean} protect_identifiers
    * @param {boolean} field_exists
    * @return {string}
    */
    __protectIdentifiers(item, prefix_single = false, protect_identifiers = undefined, field_exists = true)
    {
        if(typeof protect_identifiers!=="boolean")
        {
            protect_identifiers=true
        }
        if(item instanceof Array)
        {
            let escaped_array=[]
            item.forEach((v)=>
            {
                escaped_array.push(this.__protectIdentifiers(v))

            })
            return escaped_array
        }
        if(typeof item ==="object")
        {
            let escaped_object={}
            for(let k in item)
            {
                let v=item[k]
                escaped_object[this.__protectIdentifiers(k)]=this.__protectIdentifiers(v)
            }
            return escaped_object
        }


        item = this.filterSqlI(item)
        // Convert tabs or multiple spaces into single spaces
        if(typeof item !=="string")
            return item
        item = item.replace(/[\t ]+/g," ")
        // If the item has an alias declaration we remove it and set it aside.
        // Basically we remove everything to the right of the first space
        let alias=""
        if(item.indexOf(" ")!==-1)
        {
            alias= item.slice(item.indexOf(" "))
            item = item.slice(0,item.indexOf(" "))
            //    item = item.slice()
        }
        // This is basically a bug fix for queries that use MAX, MIN, etc.
        // If a parenthesis is found we know that we do not need to
        // escape the data or add a prefix.  There's probably a more graceful
        // way to deal with this, but I'm not thinking of it -- Rick
        if(item.indexOf("(")!==-1)
        {
            return item+alias
        }
        // Break the string apart if it contains periods, then insert the table prefix
        // in the correct location, assuming the period doesn't indicate that we're dealing
        // with an alias. While we're at it, we will escape the components
        if(item.indexOf(".")!==-1)
        {
            let parts =item.split(".")

            // Does the first segment of the exploded item match
            // one of the aliases previously identified?  If so,
            // we have nothing more to do other than escape the item
            if(this.__ar_aliased_tables.find(i=>{return parts[0]===i})!==undefined)
            {

                if(protect_identifiers===true)
                {
                    for(let key in parts)
                    {
                        if(this.__reserveIdentifiers.find(i=>{return i===parts[key]})===undefined)
                        {
                            parts[key]=this.__escapeIdentifiers(parts[key])
                        }
                    }
                    item = parts.join(".")
                }

                return item + alias
            }
            // Is there a table prefix defined in the config file?  If not, no need to do anything
            if(this.__dbprefix!=="")
            {
                // Do we have 2 segments (table.column)?
                // If so, we add the table prefix to the column name in 1st segment
                let i = 0
                // We now add the table prefix based on some logic.
                // Do we have 4 segments (hostname.database.table.column)?
                // If so, we add the table prefix to the column name in the 3rd segment.
                if(parts[3]===undefined)
                {
                    i = 2
                }  // Do we have 3 segments (database.table.column)?
                // If so, we add the table prefix to the column name in 2nd position
                else if(parts[2]===undefined)
                {
                    i = 1
                }
                // This flag is set when the supplied $item does not contain a field name.
                // This can happen when this function is being called from a JOIN.
                if(field_exists===false)
                {
                    i++
                }
                // Verify table prefix and replace if necessary
                if(this.__swap_pre!=="" && parts[i].slice(0,this.__swap_pre)===this.__swap_pre)
                {
                    parts[i]=parts[i].replace(new RegExp("/^" + this.__swap_pre + "(\\S+?)/","g"),this.__dbprefix+"\\1")// o $1
                }
                // We only add the table prefix if it does not already exist

                if(parts[i].slice(0,this.__dbprefix.length)!==this.__dbprefix)
                {
                    parts[i]=this.__dbprefix + parts[i]
                }
                // Put the parts back together

                item = parts.join(".")

            }

            if(protect_identifiers ===true)
            {

                item = this.__escapeIdentifiers(item)
            }

            return item + alias
        }
        // Is there a table prefix?  If not, no need to insert it
        if(this.__dbprefix!=="")
        {
            // Verify table prefix and replace if necessary
            if(this.__swap_pre!=="" && item.slice(0,this.__swap_pre)===this.__swap_pre)
            {
                item=item.replace(new RegExp("/^" + this.__swap_pre + "(\\S+?)/","g"),this.__dbprefix+"\\1")// o $1
            }
            // Do we prefix an item with no segments?
            if(prefix_single===true  && item.slice(0,this.__dbprefix.length)!==this.__dbprefix)
            {
                item= this.__dbprefix + item
            }
        }

        if(protect_identifiers===true && this.__reserveIdentifiers.find(i=>{return i===item})===undefined)
        {
            item = this.__escapeIdentifiers(item)
        }

        return item + alias
    }
    /**
    * convierte un arry en campos separados por ,
    * @param {array} campos
    * @return {string}
    */
    __campos(campos)
    {
        let ret = []
        for(let i in campos)
        {
            if(!/\)\s+as\s+.*/.test(campos[i]))
            {
                ret[i]=this.__protectIdentifiers(campos[i])
            }else {
                ret[i]=campos[i].replace(/\)\s+as\s+(.*)/,`) as ${this.__escapeChar}$1${this.__escapeChar}`)
            }

        }
        return ret.join()
    }
    /**
    * Da formato sql a el valor pasado en el parametro
    * @param {string|number|bolean|null|undefined} v
    * @return {string}
    */
    __formatVarInsert(result)
    {

        //console.log(/\d{0,}\.?\d{0,?}/.test(v),v)
        if(typeof result==="undefined" ||  result===null  || (typeof result==="string" && (result.toLowerCase()==="null"|| (result.toLowerCase()==="undefined"))))
        {
            return "NULL"
        }else if(typeof result==="string" && /^[\d]+(\.[\d]+)?(e\+?[\d]+)?$/i.test(result))
        {
            return result
        }else if(typeof result ==="boolean")
        {
            return result?"true":"false"
        }else {
            return sqlString.escape(result)
        }
    }
    /**
    * formatea el valor del parametro en sql pare usar en operaciones boleanas
    * @param {string|number|bolean|null|undefined} v
    * @return {string}
    */
    __formatVarSelet(v)
    {

        let result =this.__formatVarInsert(v)
        if(result==="NULL")
        {
            return "IS NULL"
        }
        return `=${result}`

    }
}
sqlHelpers.MYSQL_DB="mysql"
sqlHelpers.POSTGRESQL_DB="pg"
sqlHelpers.SQLITE3_DB="sqlite3"
module.exports=sqlHelpers
