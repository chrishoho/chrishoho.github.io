var fs = require('fs')

fs.readFile('./model.json', (err, data) => {
        var obj = JSON.parse(data)
        console.log(JSON.stringify(obj, null, "  "))
});


