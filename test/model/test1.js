const model=require("../../index.js")
const test1=new model("test1",[
    {
        name:"id",
        type:"int",
        primary:true,
        autoincrement:true
    },
    {
        name:"row1",
        type:"text"
    },
    {
        name:"row2",
        type:"int",
    },
    {
        name:"row3",
        type:"date",
    }
])
test1.foreingKey({
    key:"row2",
    reference:"test2",
    keyReference:"id_key2",
    onUpdate:'CASCADE',
    onDelete:'NO ACTION'
})
test1.insert(1,'eever',34234,'23/10/95')
module.exports=test1
