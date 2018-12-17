//const dbModel = require("./dbTablaModel")
/**
* Analiza un string sql create table y retorna los datos nesesarios para crear un modelo 
* @param {string} sqlTable - sql
* @param {string} escapeChar - caracter de escape 
* @return {object} tabla, colums, foreignkeys
*/
function sql2Model(sqlTable,escapeChar="")
{
    let colums=[]
    let primarykey=[]
    let foreignkeys=[]
    let uniqueKey=[]

    let wordEscaped=`[${escapeChar}]{0,1}[\\w]+[${escapeChar}]{0,1}`
    let wordsEscaped=`[\\w,${escapeChar}]+`
    let replaceEscapeChar=new RegExp(`[${escapeChar}]+`,"g")
    
    let sql=sqlTable.replace(new RegExp(`^[\\s\\t\\n]*CREATE[\\s\\t\\n]+TABLE[\\s\\t\\n]+${wordEscaped}\\((.*)\\)[\\s\\t\\n]*$`,"i"),"$1")
    let sqlArray=sql.split(/(^\(.*[,]+.*\)$)?[,]/)
    //console.log(sql)
    //console.log(sqlArray)
    let onForeign="(NO ACTION|RESTRICT|CASCADE|SET NULL|SET DEFAULT)"
    for(let i in sqlArray)
    {
        let value=sqlArray[i]
        if(value===undefined)
            continue
        //
        let foreign=(new RegExp(`^[\\s\\t\\n]*FOREIGN[\\s\\t\\n]+KEY[\\s\\t\\n]*\\((${wordsEscaped})\\)[\\s\\t\\n]+REFERENCES[\\s\\t\\n]+(${wordEscaped})[\\s\\t\\n]*\\((${wordsEscaped})\\)`,"i")).exec(value)
        let pry=(new RegExp(`^[\\s\\t\\n]*PRIMARY[\\s]+KEY[\\s]*\\((${wordsEscaped})\\)`,"i")).exec(value)
        let unique=(new RegExp(`^[\\s\\t\\n]*UNIQUE[\\s\\t\\n]*\\((${wordsEscaped})\\)`,"i")).exec(value)
        let index=(new RegExp(`^[\\s\\t\\n]*INDEX[\\s\\t\\n]*\\((${wordsEscaped})\\)`,"i")).exec(value)
        
        if(foreign)
        {
            let f={
                key:foreign[1].replace(replaceEscapeChar,"").split(","),
                reference:foreign[2],
                keyReference:foreign[3].replace(replaceEscapeChar,"").split(",")
            }
            let regOnDelete= (new RegExp(`[\\s\\t\\n]+on[\\s\\t\\n]+delete[\\s\\t\\n]+${onForeign}`,"i")).exec(value)
            if(regOnDelete)
            {
                f.onDelete=regOnDelete[1]
            }
            let regOnUpdate= new RegExp(`[\\s\\t\\n]+on[\\s\\t\\n]+update[\\s\\t\\n]+${onForeign}`,"i").exec(value)
            if(regOnUpdate)
            {
                f.onUpdate=regOnUpdate[1]
            }
            let regMatch= new RegExp("[\\s\\t\\n]+MATCH[\\s\\t\\n]+(FULL|PARTIAL|SIMPLE)","i").exec(value)
            if(regMatch)
            {
                f.match=regMatch[1]
            }
            foreignkeys.push(f)
        }else if(pry)
        {
            for(let key of pry[1].replace(replaceEscapeChar,"").split(","))
            {
                primarykey.push(key)
            }
        }else if(unique)
        {
            for(let key of unique[1].replace(replaceEscapeChar,"").split(","))
            {
                uniqueKey.push(key)
            }
        }else if(!index)
        {
            let ex=(new RegExp(`^[\\s\\t\\n]*(${wordEscaped})[\\s\\t\\n]+([\\w]+)([\\s\\t\\n]+(null|not null))?([\\s\\t\\n]+(default)[\\s\\t\\n]+(['"].*["']|[\\w]+))?`,"i")).exec(value)
            //console.log(ex)
            colums.push({
                name:ex[1].replace(replaceEscapeChar,""),
                type:ex[2].replace(replaceEscapeChar,""),
                defaultNull:typeof ex[4]==="string" && ex[4].toLowerCase()=="null",
                primary:false,
                unique:false,
                defaul:typeof ex[7]==="string"?ex[7].replace(/^'(.*)'$/,"$1"):""
            })
            
        }
    }
    for(let key of primarykey)
    {
        let findex=colums.findIndex(c=>c.name===key)
        
        if(findex!==-1)
        {
            colums[findex].primary=true
        }
    }
    for(let key of uniqueKey)
    {
        let findex=colums.findIndex(c=>c.name===key)
        
        if(findex!==-1)
        {
            colums[findex].unique=true
        }
    }
    
    let regTabla=new RegExp(`^[\\s\\t\\n]*CREATE[\\s\\t\\n]+TABLE[\\s\\t\\n]+[${escapeChar}]{0,1}([\\w]+)[${escapeChar}]{0,1}\\(.*\\)$`,"i")
    return  {
        tabla:sqlTable.replace(regTabla,"$1"),
        colums:colums,
        foreignkeys:foreignkeys
    }
}
module.exports=sql2Model