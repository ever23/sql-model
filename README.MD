# tabla-model

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]

## Tabla de contenidos

- [Install](#install)
- [Introduccion](#introduccion)
- [Uso](#uso)

## install

tabla-model es un  modulo de [Node.js](https://nodejs.org/es/) valido registrado en [npm registry](https://www.npmjs.com/).

Para instalar use [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install tabla-model
```
## introduccion

tabla-model crear representaciones de tablas sql en  modelos de datos javasript y viseversa.


## uso

para usar tabla-model solo es neseario instancear un objeto de la clase principal y agregar los datos

Ejemplo:
```js
// file ./model/test1.js
const model=require("tabla-model")
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
## sqlModel#constructor(tabla,config)
Constructor de la clase

* `tabla {string}`: nombre de la tabla o sentencia sql para crear una tabla y se usaran los campos y claves foraneas de la sentencia
* `config {object|array}`: si el primer parametro es el nombre de una tabla este sera los datos de el modelo *`{colums:Array, foreingKey:Array}`* si es un array se tomara como las columnas en caso de que el primer parametro sea un sentencia sql *CREATE TABLE* este sera el caracter de escape sql

```js
const model=require("tabla-model")
const test1=new model("test3",{
    colums:[
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
    ],
    foreingKey:[
        { // se agrega las claves foraneas
            key:"row2",
            reference:"test4",
            keyReference:"id_key2",
            onUpdate:'CASCADE',
            onDelete:'NO ACTION',
            // match: ' '
        }
    ]
})
```
```js
const model=require("tabla-model")
const test1=new model(`create table test1(
    id int not null AUTO_INCREMENT,
    row1 text,
    row2 int,
    row3 date,
    primary key (id),
    foreing key row2 references test4(id_key2)
    on update cascade
    on delete no action
    )`)
```

## sqlModel#colum(coll)
Agrega una columna al modelo

* `coll {object}`: objeto con los datos de la columna, este objeto debe contar con los siguientes atributos
```js
{
    name:String,//nombre de la columna
    type:String,// tipo de dato de la columna segun el motor de base de datos
    defaultNull:Boolean,//(opcional) true si el valor por defecto puede ser null
    primary:Boolean,//(opcional) true si es una clave primaria
    unique:Boolean,//(opcional) true si es una indice unico
    defaul:String//(opcional)  valor por defecto
}
```

## sqlModel#foreingKey(key)
Agrega una clave foraanea a el modelo

* `key {object}`: objeto con los datos clave foranea, este objeto debe contar con los siguientes atributos
```js
{
    key:String|Array,// nombre del campo para la clave foranea  
    reference:String,// nombre de la tabla a la que hace referencia
    keyReference:String|Array,//nombre del campo en la table de referencia
    match:String,//
    onDelete:String,//indica que acciones se deben realizar en la tabla actual
    // si se borra una fila en la tabla referenciada
    onUpdate:String//indica que acciones se deben realizar en la tabla actual
    // si se edita una fila en la tabla referenciada
}
```

## sqlModel#insert(...params)
Agrega datos a para la inicializacion de la tabla

* `...params`: se pueden agregar parametro a parametro o en un array en un unico parametro

## sqlModel#method(name,callback)
Agrega un metodo al modelo de la tabla

* `name {string}`: nombre del metodo
* `callback {function}`: funcion correspondiente

## sqlModel#getData()
Retorna un objeto con todos los datos agregados al modelo en el formato
*
```js
{
    tabla:String,// nombre de la tabla
    colums:Array,// columnas de la tabla
    foreingKey:Array,// claves foranes de la tabla
    init:Array,// datos de inicializacion
    methods:Object// metodos agregados al modelo
}
```

## sqlModel#sql(config)

Retorna el sql nesesario para crear la tabla del modelo

* `config {object}`: configuracion para el helper `{escapeChar:String, reserveIdentifiers:Array, ar_aliased_tables:String, dbprefix:String, escapeString:String}`
```js
const model=require("tabla-model")
const test1=new model("test3",{
    colums:[
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
    ],
    foreingKey:[
        { // se agrega las claves foraneas
            key:"row2",
            reference:"test4",
            keyReference:"id_key2",
            onUpdate:'CASCADE',
            onDelete:'NO ACTION',
            // match: ' '
        }
    ]
})
console.log(test1.sql({escapeString:"`"}))
```

## sqlModel#saveModel(file)

Crea un archivo javascript con los datos del modelo para ser usado 

* `file`: Nombre del fichero donde sera guardado el modelo 



[npm-image]: https://img.shields.io/npm/v/tabla-model.svg
[npm-url]: https://npmjs.org/package/tabla-model
[node-version-image]: https://img.shields.io/node/v/tabla-model.svg
[node-version-url]: https://nodejs.org/en/download/
[downloads-image]: https://img.shields.io/npm/dm/tabla-model.svg
[downloads-url]: https://npmjs.org/package/tabla-model
