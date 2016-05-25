var moduleExample = require('module-example');
var moduleExampleApiInternal = new moduleExample.internal();

//Call API as internal module
console.log(moduleExampleApiInternal.getName(), moduleExampleApiInternal.getVersion());