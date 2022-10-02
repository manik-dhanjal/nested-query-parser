# nested-query-parser

Parse nested JSON to readable URL query string.

## Install
```
$ npm install nested-query-parser
```

**Not `npm install nested-query-parser`!!!!!**

This module targets Node.js 6 or later and the latest version of Chrome, Firefox, and Safari.

## Usage
```js
const qp = require('nested-query-parser');

const query = { 
    foo:"bar",
    fizz:"buzz"
 }

const queryString = qp.encode(query);
console.log(queryString);
//=> {?foo=bar&fizz=buzz}

const queryJson = qp.decode(queryString);
console.log(queryJson);
//=> { foo:"bar", fizz:"buzz" }
```

## API
### .encode( object )
The encode method transforms a given JSON/Array in to a query string.  By default we return the query string with a ? prefix.
```js
const qp = require('nested-query-parser');

qp.encode({ foo: 'bar' });                //=> ?foo=bar
qp.encode({ foo: '' });                   //=> ?foo=
qp.decode({ num: 2.2, str: '2.2' })       //=> ?num=%2.2%&str=2.2 
qp.encode({ foo: ['b','a'] });            //=> ?foo:[0]=b&foo:[1]=a
qp.encode({ foo:true, bar:false })        //=> ?foo=%TRUE%&bar=%FALSE%
qp.encode({ a:{ b:{ c: ['c1','c2'] } })   //=> ?a:b:c:[0]=c1&a:b:c:[1]=c2
```

### .decode( string )
The decode method transforms a given query string in to an object. Parameters without values are set to empty strings.It extracts keys and values between & = and covert reserved words to javascript keywords.

```js
const qp = require('nested-query-parser');

qp.decode('?foo=bar');                    //=> { foo: 'bar' }
qp.decode('?num=%2.2%&str=2.2');          //=> { num: 2.2, str: '2.2' }
qp.decode('?and=%AND%');                  //=> { and: '&' }
qp.decode('?question=%QUESTION%');        //=> { question: '?' }
qp.decode('?equal=%EQUAL%');              //=> { equal: '=' }
qp.decode('?null=%NULL%');                //=> { null: null }
```

## Reserved Symbols and Keywords
Symbols and keywords are reserved to avoid bugs introduced while decoding string in a readable way.

| Encoded Keyword | Decoded Keyword |
|-----------------|-----------------|
| "%EQUAL%"       | "="             |
| "%QUESTION%"    | "?"             |
| "%PLUS%"        | "+"             |
| "%COLON%"       | ":"             |
| "%AND%"         | "&"             |
| "%PERCENT%"     | "%"             |
| "%LBRAC%"       | "["             |
| "%RBRAC%"       | "]"             |
| "%NULL%"        | `null`          |
| "%UNDEFINED%"   | `undefined`     |
| "%FALSE%"       | `false`         |
| "%TRUE%"        | `true`          |
| "%23.21%" ( any_number )| `23.21`   |

## Contribution
Open to contribution and updates to make this library more versatile

## License
Apache 2.0