# Network Wrapper


## Simple nework wrapper

 * Wrap network comopnent
 * Instroduce simplest way to working with network
 * Support wide of many network implement
 * You are able to change base implement

## Example

Here is some example, enjoy it :+1:

### Setup
```javascript
//Setup network
network.setup({
    url: 'https://www.example.com/api',
    method: 'POST',
    dataType: 'json'
});
```

### Push data to stack

```javascript
//Push data element to stack
network.push(
    {
        call: 'getBalance',
        data: {
            address: 'example1',
            type: 'example2'
        }
    }
);

//Push data element to stack
network.push(
    {
        call: 'getTransaction',
        data: {
            address: 'example3',
            type: 'example4'
        }
    }
);
```

### Data in stack is like that

```javascript
[
    {
        call: 'getBalance',
        data: {
            address: 'example1',
            type: 'example2'
        }
    },
    {
        call: 'getTransaction',
        data: {
            address: 'example3',
            type: 'example4'
        }
    }    
]
```

### Receiver

```javascript
//You mus define receive function before send data
network.receive(function(err, data){
    if(!err){
        //Data process here
        console.log(data);
    }
});
```

### Send

```javascript
//Trigger send event
network.send();
```

## Credits
Thanks you, for reading. Have any question please contact me via email [tad88.dev@gmail.com](mailto://tad88.dev@gmail.com)

* [Facebook](https://www.facebook.com/tad88.dev) My facebook
* [FkGuru](https://www.fkguru.com) My website
* [On Github](https://github.com/tad88.dev) My Git
