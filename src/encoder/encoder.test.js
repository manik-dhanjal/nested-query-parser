const encodeQuery = require("./encoder")

describe("encodeQuery():",() => {

    test(`query should create string like querystring.stringfy() for unnested json`,()=>{
        expect( encodeQuery({ a:"a", b:"b", c:"c"}) ).toEqual("?a=a&b=b&c=c");
    })

    test("exections",()=>{
        expect( () => encodeQuery() ).toThrowError();
        expect( () => encodeQuery(null) ).toThrowError();
    })

    test("empty json and array",() => {
        expect( encodeQuery({}) ).toEqual("");
        expect( encodeQuery([])).toEqual("");
    })

    test("includes number, float, integer",() => {
        expect( encodeQuery({ a:-1, b:0, c:1 })).toEqual("?a=%-1%&b=%0%&c=%1%")
        expect( encodeQuery({ a:1.23, b:0.00, c:-21.2120 })).toEqual("?a=%1.23%&b=%0%&c=%-21.212%")
        expect( encodeQuery({ a:"-2", b:"000", c:"-02", d:"0210" })).toEqual("?a=-2&b=000&c=-02&d=0210")
    })

    test(`includes special charachters`, ()=>{
        expect( encodeQuery({ "~!@#$%^&*()_{}:<>,.?+/=[];|":"~!@#$%^&*()_{}:<>,.?+/=[];|"}) )
        .toEqual("?~!@#$%PERCENT%^%AND%*()_{}%COLON%<>,.%QUESTION%%PLUS%/%EQUAL%%LBRAC%%RBRAC%;|=~!@#$%PERCENT%^%AND%*()_{}%COLON%<>,.%QUESTION%%PLUS%/%EQUAL%%LBRAC%%RBRAC%;|");
    })

    test(`includes empty string`,()=>{
        expect( encodeQuery({ a:2, b:"b", c:"",d:"d" }) ).toEqual("?a=%2%&b=b&c=&d=d");
    })

    test("includes null",() => {
        expect( encodeQuery({ a:null, b:"b", c:"null" }) ).toEqual("?a=%NULL%&b=b&c=null");
    });

    test("includes undefined",() => {
        expect( encodeQuery({ a:undefined, b:"b", c:"undefined", d:21 })).toEqual("?a=%UNDEFINED%&b=b&c=undefined&d=%21%");
    });

    test("includes boolean", () => {
        expect( encodeQuery({ a:true, b:false, c:0, d:1 })).toEqual("?a=%TRUE%&b=%FALSE%&c=%0%&d=%1%");
    })
    test("query is an array",() => {
        expect( encodeQuery( [1, "a1", null, true, false] ) )
        .toEqual("?[0]=%1%&[1]=a1&[2]=%NULL%&[3]=%TRUE%&[4]=%FALSE%");
        expect( encodeQuery( [1, "a1", [null, 2,[true],[[]],[],"red"],[[],[],[[]]] ,false] ) )
        .toEqual("?[0]=%1%&[1]=a1&[2]:[0]=%NULL%&[2]:[1]=%2%&[2]:[2]:[0]=%TRUE%&[2]:[3]=red&[3]=%FALSE%");
        expect( encodeQuery( [1, "a1", { b:null, c:"c1" }, null, true, false] ) )
        .toEqual("?[0]=%1%&[1]=a1&[2]:b=%NULL%&[2]:c=c1&[3]=%NULL%&[4]=%TRUE%&[5]=%FALSE%");
    })
    test("includes array", ()=> {
        expect( encodeQuery({ a:[1, "a1", { b:null, c:"c1" }, null, true, false] }) )
        .toEqual("?a:[0]=%1%&a:[1]=a1&a:[2]:b=%NULL%&a:[2]:c=c1&a:[3]=%NULL%&a:[4]=%TRUE%&a:[5]=%FALSE%");
    });

    test("query have deeply nested json",() => {
        expect( encodeQuery({
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
        }) ).toEqual("?a:b:c:[0]=c1&a:b:c:[1]=c2&a:b:d=%2%&a:e=e1&a:j=%TRUE%&a:c=%UNDEFINED%&f:[0]:g=g1&f:[1]:h:[0]=h1&f:[1]:h:[1]=h2&f:[2]:i:i=%1%")
    })
})
