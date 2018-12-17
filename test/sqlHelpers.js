const assert= require("assert")
const sqlHelpers= require("../sqlHelpers")
describe("Test de la clase sqlHelpers",()=>
{
    let config={
        escapeChar:"`",
        escapeString:e=>e
    }
    it("verificacion de metodos",()=>
    {
        let helper = new sqlHelpers(config)
        assert.equal(typeof helper.__object2boleandSql,"function")
        assert.equal(typeof helper.__protectIdentifiersBolean,"function")
        assert.equal(typeof helper.filterSqlI,"function")
        assert.equal(typeof helper.__escapeIdentifiers,"function")
        assert.equal(typeof helper.__protectIdentifiers,"function")
        assert.equal(typeof helper.__campos,"function")
        assert.equal(typeof helper.__formatVarInsert,"function")
        assert.equal(typeof helper.__formatVarSelet,"function")
    })
    it("metodo __object2boleandSql",()=>
    {
        let helper = new sqlHelpers(config)
        let result1="`id`='12a' AND `id2`=3"
        let result2="`id`='12a' OR `id2`=3"
        let result3="`id`='12a' AND `id2`=3"
        let result4="(`id`=1 OR `id`=2 OR `id`=3) AND `id2`=3"
        assert.equal(helper.__object2boleandSql({id:"12a","id2":3}),result1)
        assert.equal(helper.__object2boleandSql({id:"12a","||id2":3}),result2)
        assert.equal(helper.__object2boleandSql({id:"12a","&&id2":3}),result3)
        assert.equal(helper.__object2boleandSql({id:[1,2,3],"id2":3}),result4)
        assert.equal(helper.__object2boleandSql({"id2!=":3}),"`id2`!=3")
        assert.equal(helper.__object2boleandSql({"id2>":3}),"`id2`>3")
        assert.equal(helper.__object2boleandSql({"id2<":3}),"`id2`<3")
        assert.equal(helper.__object2boleandSql({"id2>=":3}),"`id2`>=3")
        assert.equal(helper.__object2boleandSql({"id2<=":3}),"`id2`<=3")
        assert.equal(helper.__object2boleandSql({"id2%":"3s"}),"`id2` LIKE '3s'")

    })
    it("metodo __escapeIdentifiers",()=>
    {
        let helper = new sqlHelpers(config)
        assert.equal(helper.__escapeIdentifiers("row1"),"`row1`")
        assert.equal(helper.__escapeIdentifiers("row1.a"),"`row1`.`a`")
        assert.equal(helper.__escapeIdentifiers("row1.*"),"`row1`.*")

    })
    it("metodo __protectIdentifiers",()=>
    {
        let helper = new sqlHelpers(config)
        assert.equal(helper.__protectIdentifiers("row1"),"`row1`")
        assert.deepEqual(helper.__protectIdentifiers(["row1","row2"]),["`row1`","`row2`"])
        //assert.equal(helper.__escapeIdentifiers("row1.a"),'`row1`.`a`')
    })

    it("metodo __campos",()=>
    {
        let helper = new sqlHelpers(config)
        let params=["row1","row2","row3.a","count(*) as e"]
        assert.equal(helper.__campos(params),"`row1`,`row2`,`row3`.`a`,count(*) as `e`")
    })
    it("metodo __formatVarInsert",()=>
    {
        let helper = new sqlHelpers(config)
        let params=["var1","var2",3,true,undefined,null]
        assert.equal(helper.__formatVarInsert("var1"),"'var1'")
        assert.equal(helper.__formatVarInsert("var2"),"'var2'")
        assert.equal(helper.__formatVarInsert("3"),"3")
        assert.equal(helper.__formatVarInsert(3),"3")
        assert.equal(helper.__formatVarInsert(undefined),"NULL")
        assert.equal(helper.__formatVarInsert(null),"NULL")


    })
    it("metodo __formatVarSelet",()=>
    {
        let helper = new sqlHelpers(config)
        let params=["var1","var2",3,true,undefined,null]
        assert.equal(helper.__formatVarSelet("var1"),"='var1'")
        assert.equal(helper.__formatVarSelet("var2"),"='var2'")
        assert.equal(helper.__formatVarSelet("3"),"=3")
        assert.equal(helper.__formatVarSelet(3),"=3")
        assert.equal(helper.__formatVarSelet(undefined),"IS NULL")
        assert.equal(helper.__formatVarSelet(null),"IS NULL")

    })
    it("metodo __protectIdentifiersBolean",()=>
    {
        let helper = new sqlHelpers(config)
        assert.equal(helper.__protectIdentifiersBolean("row1=1 or row2 = 'a' and tab.row3=ab"),"`row1`=1 or `row2`='a' and `tab`.`row3`=ab")
    })

})
