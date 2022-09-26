const {WORD_TO_SYMBOL} = require("../constants/mapSpecialSymbol.constants");

const getWordCountInStr = (str) => {
    let count = 0;
    for(let i=0;i<str.length;i++){
        if(str[i] == "%") count++;
    }
    return count/2;
}
const parseValue = (str) => {
    const wordCountInStr = getWordCountInStr(str);
    if(wordCountInStr==1 && str[0]=="%" && str[str.length-1]=="%"){
        if(WORD_TO_SYMBOL.hasOwnProperty(str)){
            return WORD_TO_SYMBOL[str];
        }
        if(!isNaN( str.slice(1,str.length-1)) ){
            return Number(str.slice(1,str.length-1));
        }
        return str;
    }
    let ans="";
    let key = "";
    for(let i=0; i<str.length; i++){
        if( key || str[i]=="%" ){
            key += str[i];
            if(key.length>1 && key[0]=="%" && key[key.length-1]=="%"){
                ans+=WORD_TO_SYMBOL[key];
                key="";
            }
        }else{
            ans += str[i];
        }
    }
    return ans;
}

const convertQueryStrToArr = (query_str) =>{
    let val = "";
    let key = "";
    let takeVal = false;
    let takeKey = false;
    let ans = [];
    for(let i=0;i<query_str.length;i++){
        if(query_str[i]=='?'){
            takeKey = true;
            takeVal = false;
        }else if(query_str[i] == '&'){
            takeKey = true;
            takeVal=false;
            key = "";
            ans[ans.length-1].val = val;
        }else if( query_str[i] == '=' ){
            takeVal = true;
            takeKey = false;
            val = "";
            ans.push({key: key.split(":")}) 
        }else if(takeKey){
            key += query_str[i];
        }else if(takeVal){
            val += query_str[i];
        }
    }
    if(ans.length){
        ans[ans.length-1].val = val;
    }
    return ans;
}
const convertQuery = (query,keyId,resObj) => {
    if(keyId == query.key.length) return parseValue(query.val);
    if(query.key[keyId][0]=='[' && query.key[keyId][2]==']'){
        if(!resObj){
            resObj = [];
        }
        const arrIdx = parseInt(query.key[keyId][1]);
        for(let curArrId = resObj.length-1; curArrId < arrIdx; curArrId++) 
            resObj.push(null);
        resObj[arrIdx] = convertQuery(query, keyId+1, resObj[arrIdx]);
    }else{
        const parsedKey = parseValue(query.key[keyId])
        if(!resObj){
            resObj = {};
            resObj[parsedKey] = null;
        }
        resObj[parsedKey] = convertQuery(query,keyId+1,resObj[parsedKey])
    }

    return resObj;
}
const isResultObjArray = (query_arr) => {
    return query_arr.reduce((res,cur) => {
        if(cur.key[0][0]=='[' && cur.key[0][2]==']' && res) return true;
        return false;
    },true);
}
const decodeQuery = (query_str) => {
    if(!query_str && typeof query_str !== "string") 
        throw new Error("decodeQuery(query_string) function needs a query_string as argument");
    if(query_str.length<2){
        return {};
    }
    const query_arr = convertQueryStrToArr(query_str);
    let resultObj = null;
    query_arr.forEach((query_item) => {
      resultObj =  convertQuery(query_item,0,resultObj);
    })
    return resultObj;
}
module.exports = decodeQuery;