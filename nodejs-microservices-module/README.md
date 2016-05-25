# Nodejs Microservices Module Example


## Microservices Module

 * Easy and fast to handle microservices module
 * Build your own microservice system base on this model
 * Clearly to understand

## Example

Our module locate at ./node_modules/index.js this module contain
* Internal API
* API client
* API server provider

### User module as internal API
```javascript
var moduleExample = require('module-example');
var moduleExampleApiInternal = new moduleExample.internal();

//Call API as internal module
console.log(moduleExampleApiInternal.getName(), moduleExampleApiInternal.getVersion());
```
Result
```bash
$ node internal.js
module-example 0.0.1
```

### Start API server

```javascript
var moduleExample = require('module-example');
var moduleExampleApiServer = new moduleExample.server();

//Start API server
moduleExampleApiServer.start();
```
Result
```bash
$ node server.js
API server online, port 8080
```

### Run API client

```javascript
var moduleExample = require('module-example');
var moduleExampleApiClient = new moduleExample.client();

//Call API as client (server is require)
moduleExampleApiClient.getName(function (data)
{
    console.log(data);
});

moduleExampleApiClient.getVersion(function (data)
{
    console.log(data);
});
```
Result
```bash
$ node client.js
{ name: 'module-example' }
{ version: '0.0.1' }
```

## Credits
Thanks you, for reading. Have any question please contact me via email [tad88.dev@gmail.com](mailto://tad88.dev@gmail.com)

* [Facebook](https://www.facebook.com/tad88.dev) My facebook
* [FkGuru](https://www.fkguru.com) My website
* [On Github](https://github.com/tad88.dev) My Git
