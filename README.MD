# dbTabla

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]

## Tabla de contenidos
 
- [Install](#install)
- [Introduccion](#introduccion)
- [Uso](#uso)

## install

sql-model es un  modulo de [Node.js](https://nodejs.org/es/) valido registrado en [npm registry](https://www.npmjs.com/).

Para instalar use [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install sql-model
```
## introduccion

sql-model crear representaciones de tablas sql en  modelos de datos javasript y viseversa.


## uso 

para usar sql-model solo es neseario instancear un objeto de la clase principal y agregar los datos 

Ejemplo:
```js
// file ./model/test1.js 
const model=require("sql-model")
const test1=new model("test3",[
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
test1.foreingKey({ // se agrega las claves foraneas 
    key:"row2",
    reference:"test4",
    keyReference:"id_key2",
    onUpdate:'CASCADE',
    onDelete:'NO ACTION',
    // match: ' '
})
console.log(test1.sql())
```


[npm-image]: https://img.shields.io/npm/v/sql-model.svg
[npm-url]: https://npmjs.org/package/sql-model
[node-version-image]: https://img.shields.io/node/v/sql-model.svg
[node-version-url]: https://nodejs.org/en/download/
[coveralls-url]: https://coveralls.io/r/mysqljs/mysql?branch=master
[downloads-image]: https://img.shields.io/npm/dm/sql-model.svg
[downloads-url]: https://npmjs.org/package/sql-model
