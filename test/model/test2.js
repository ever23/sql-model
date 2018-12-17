const model=require("../../index.js")
const test2=new model("test2",[
    {
        name:"id_key2",
        type:"int",
        defaultNull:false,
        primary:true,
    },
    {
        name:"row1",
        type:"text",
        defaultNull:false,
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
module.exports=test2
