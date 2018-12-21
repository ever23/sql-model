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
        assert.equal(typeof helper.object2boleandSql,"function")
        assert.equal(typeof helper.protectIdentifiersBolean,"function")
        assert.equal(typeof helper.filterSqlI,"function")
        assert.equal(typeof helper.escapeIdentifiers,"function")
        assert.equal(typeof helper.protectIdentifiers,"function")
        assert.equal(typeof helper.campos,"function")
        assert.equal(typeof helper.formatVarInsert,"function")
        assert.equal(typeof helper.formatVarSelet,"function")
    })
    it("metodo __object2boleandSql",()=>
    {
        let helper = new sqlHelpers(config)
        let result1="`id`='12a' AND `id2`=3"
        let result2="`id`='12a' OR `id2`=3"
        let result3="`id`='12a' AND `id2`=3"
        let result4="(`id`=1 OR `id`=2 OR `id`=3) AND `id2`=3"
        assert.equal(helper.object2boleandSql({id:"12a","id2":3}),result1)
        assert.equal(helper.object2boleandSql({id:"12a","||id2":3}),result2)
        assert.equal(helper.object2boleandSql({id:"12a","&&id2":3}),result3)
        assert.equal(helper.object2boleandSql({id:[1,2,3],"id2":3}),result4)
        assert.equal(helper.object2boleandSql({"id2!=":3}),"`id2`!=3")
        assert.equal(helper.object2boleandSql({"id2>":3}),"`id2`>3")
        assert.equal(helper.object2boleandSql({"id2<":3}),"`id2`<3")
        assert.equal(helper.object2boleandSql({"id2>=":3}),"`id2`>=3")
        assert.equal(helper.object2boleandSql({"id2<=":3}),"`id2`<=3")
        assert.equal(helper.object2boleandSql({"id2%":"3s"}),"`id2` LIKE '3s'")
        assert.equal(helper.object2boleandSql({"id2":null}),"`id2` IS NULL")
        assert.equal(helper.object2boleandSql({"id2!=":null}),"`id2` IS NOT NULL")
        assert.equal(helper.object2boleandSql({id:[1,null,3],"id2":3}),"(`id`=1 OR `id` IS NULL OR `id`=3) AND `id2`=3")
    })
    it("metodo __escapeIdentifiers",()=>
    {
        let helper = new sqlHelpers(config)
        assert.equal(helper.escapeIdentifiers("row1"),"`row1`")
        assert.equal(helper.escapeIdentifiers("row1.a"),"`row1`.`a`")
        assert.equal(helper.escapeIdentifiers("row1.*"),"`row1`.*")
        assert.equal(helper.escapeIdentifiers("a.b.c"),"`a`.`b`.`c`")
    })
    it("metodo __protectIdentifiers",()=>
    {
        let helper = new sqlHelpers(config)
        assert.equal(helper.protectIdentifiers("row1"),"`row1`")
        assert.deepEqual(helper.protectIdentifiers(["row1","row2"]),["`row1`","`row2`"])
        //assert.equal(helper.escapeIdentifiers("row1.a"),'`row1`.`a`')
    })
    it("metodo __protectIdentifiersBolean",()=>
    {
        let helper = new sqlHelpers(config)
        assert.equal(helper.protectIdentifiersBolean("row1=1 or row2 = 'a' and tab.row3=ab"),"`row1`=1 or `row2`='a' and `tab`.`row3`=ab")
    })
    it("metodo __campos",()=>
    {
        let helper = new sqlHelpers(config)
        let params=["row1","row2","row3.a","count(*) as e","count(row1) as a"]
        assert.equal(helper.campos(params),"`row1`,`row2`,`row3`.`a`,count(*) as `e`,count(row1) as `a`")
    })
    it("metodo __formatVarInsert",()=>
    {
        let helper = new sqlHelpers(config)
        let params=["var1","var2",3,true,undefined,null]
        assert.equal(helper.formatVarInsert("var1"),"'var1'")
        assert.equal(helper.formatVarInsert("var2"),"'var2'")
        assert.equal(helper.formatVarInsert("3"),"3")
        assert.equal(helper.formatVarInsert(3),"3")
        assert.equal(helper.formatVarInsert(undefined),"NULL")
        assert.equal(helper.formatVarInsert(null),"NULL")
    })
    it("metodo __formatVarSelet",()=>
    {
        let helper = new sqlHelpers(config)
        let params=["var1","var2",3,true,undefined,null]
        assert.equal(helper.formatVarSelet("var1"),"='var1'")
        assert.equal(helper.formatVarSelet("var2"),"='var2'")
        assert.equal(helper.formatVarSelet("3"),"=3")
        assert.equal(helper.formatVarSelet(3),"=3")
        assert.equal(helper.formatVarSelet(undefined),"IS NULL")
        assert.equal(helper.formatVarSelet(null),"IS NULL")

    })
    

})
