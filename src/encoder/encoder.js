

const {SYMBOL_TO_WORD} = require("../constants/mapSpecialSymbol.constants");

const handleReservedSymbols = (value) =>{
    if(typeof value == 'number'){
        return "%"+value+"%";
    }else if(typeof value === 'string'){
        let res = "";
        for(let i=0; i<value.length; i++){
            res += SYMBOL_TO_WORD[value[i]]?SYMBOL_TO_WORD[value[i]]:value[i]
        }
        return res;
    }else{
        return SYMBOL_TO_WORD[value]||value;
    }
}

const parseArray = (arr,prefix="") =>{
    let result = "";
    let index = 0;
    for(let idx =0; idx<arr.length;idx++){
        const createPrefix = prefix ? prefix+":" : "";
        if(Array.isArray(arr[idx])){
            const parsedArray = parseArray(arr[idx],createPrefix+"["+index+"]")
            result += result && parsedArray ? "&" : "";
            result += (parsedArray?  parsedArray : "");
            if(parsedArray) index++;
        }else if(arr[idx] && typeof arr[idx] === 'object'){
            const parsedObj = parseObject(arr[idx],createPrefix+"["+index+"]");
            result += result && parsedObj ? "&" : "";
            result += parsedObj
            if(parsedObj) index++;
        }else{
            result += result? "&" : "";
            result += createPrefix+"["+index+"]="+handleReservedSymbols(arr[idx]);
            index++;
        }
    }
    return result;
}

const parseObject = (obj,prefix="") => {
    let result = "";
    for(let key in obj){
        const parsedKey = handleReservedSymbols(key)
        const createPrefix = prefix ? prefix+":" : "";
        if(Array.isArray(obj[key])){
            const parsedArray = parseArray(obj[key], createPrefix+parsedKey)
            result += result && parsedArray ? "&" : "";
            result += (parsedArray? parsedArray : "");
        }else if(obj[key] && typeof obj[key] === 'object'){
            const parsedObj = parseObject(obj[key], createPrefix+parsedKey);
            result += result && parsedObj ? "&" : "";
            result += parsedObj;
        }else{
            result += result ? "&" : "";
            result += createPrefix+parsedKey+"="+handleReservedSymbols(obj[key]);
        }
    }
    return result;
}

const encodeQuery = (query_json) => {
    // console.log(typeof query_json)
    if(!query_json || typeof query_json !== "object") 
        throw new Error("encodeQuery(query_json) function needs a json object as argument");
  
    if(Array.isArray(query_json)){
        const parsedArray = parseArray(query_json)
        return parsedArray? ("?" + parsedArray ) : "";
    }else{
        const parsedObj = parseObject(query_json)
        return parsedObj? ("?" + parsedObj ) : "";
    }
}

module.exports = encodeQuery;