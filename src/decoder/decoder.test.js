const decodeQuery = require("./decoder")

describe("decodeQuery():",() => {

    test(`query should create object like querystring.stringfy() for unnested string`,()=>{
        expect( decodeQuery("?a=a&b=b&c=c") ).toEqual({ a:"a", b:"b", c:"c"});
    })
    test("exceptions",() => {
        expect(() => decodeQuery() ).toThrowError();
        expect(() => decodeQuery(null) ).toThrowError();
    })
    test("empty string",() => {
        expect( decodeQuery("") ).toEqual({});
        expect( decodeQuery("?") ).toEqual({});
    })

    test("includes number, float, integer",() => {
        expect( decodeQuery("?a=%-1%&b=%0%&c=%1%")).toEqual({ a:-1, b:0, c:1 })
        expect( decodeQuery("?a=%1.23%&b=%0%&c=%-21.212%")).toEqual({ a:1.23, b:0.00, c:-21.2120 })
        expect( decodeQuery("?a=-2&b=%0%&c=%-2%&d=0210")).toEqual({ a:"-2", b:0, c:-2, d:"0210" })
    })

    test(`includes special charachters`, ()=>{
        expect( decodeQuery("?~!@#$%PERCENT%^%AND%*()_{}%COLON%<>,.%QUESTION%%PLUS%/%EQUAL%%LBRAC%%RBRAC%;|=~!@#$%PERCENT%^%AND%*()_{}%COLON%<>,.%QUESTION%%PLUS%/%EQUAL%%LBRAC%%RBRAC%;|") )
        .toEqual({ "~!@#$%^&*()_{}:<>,.?+/=[];|":"~!@#$%^&*()_{}:<>,.?+/=[];|"});
    })

    test(`includes empty string`,()=>{
        expect( decodeQuery("?a=%2%&b=b&c=&d=d") ).toEqual({ a:2, b:"b", c:"",d:"d" });
    })

    test("includes null",() => {
        expect( decodeQuery("?a=%NULL%&b=b&c=null") ).toEqual({ a:null, b:"b", c:"null" });
    });

    test("includes undefined",() => {
        expect( decodeQuery("?a=%UNDEFINED%&b=b&c=undefined&d=21")).toEqual({ a:undefined, b:"b", c:"undefined", d:"21" });
    });

    test("includes boolean", () => {
        expect( decodeQuery("?a=%TRUE%&b=%FALSE%&c=%0%&d=%1%")).toEqual({ a:true, b:false, c:0, d:1 });
    })

    test("query is an array",() => {
        expect( decodeQuery( "?[0]=%1%&[1]=a1&[2]=%NULL%&[3]=%TRUE%&[4]=%FALSE%" ) )
        .toEqual( [1, "a1", null, true, false] );

        expect( decodeQuery( "?[0]=%1%&[1]=a1&[2]:[0]=%NULL%&[2]:[1]=%2%&[2]:[2]:[0]=%TRUE%&[2]:[3]=red&[3]=%FALSE%" ) )
        .toEqual( [1, "a1", [null, 2,[true],"red"],false] );

        expect( decodeQuery( "?[0]=%1%&[1]=a1&[2]:b=%NULL%&[2]:c=c1&[3]=%NULL%&[4]=%TRUE%&[5]=%FALSE%" ) )
        .toEqual( [1, "a1", { b:null, c:"c1" }, null, true, false]);
    })

    test("includes array", ()=> {
        expect( decodeQuery("?a:[0]=%1%&a:[1]=a1&a:[2]:b=%NULL%&a:[2]:c=c1&a:[3]=%NULL%&a:[4]=%TRUE%&a:[5]=%FALSE%") )
        .toEqual({ a:[1, "a1", { b:null, c:"c1" }, null, true, false] });
    });

    test("query have deeply nested json",() => {
        expect( decodeQuery("?a:b:c:[0]=c1&a:b:c:[1]=c2&a:b:d=%2%&a:e=e1&a:j=%TRUE%&a:c=%UNDEFINED%&f:[0]:g=g1&f:[1]:h:[0]=h1&f:[1]:h:[1]=h2&f:[2]:i:i=%1%") )
        .toEqual({
            a:{
                b:{
                    c:["c1","c2"],
                    d:2,
                },
                e:"e1",
                j:true,
                c:undefined,
            },
            f:[ { g:"g1" },{ h:["h1","h2"] },{ i:{ i:1 } } ],
        })
    })
})
