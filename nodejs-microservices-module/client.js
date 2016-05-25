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