const fs = require("fs");
const express = require('express');
const app = express()
const port = 8080

let data_file = fs.readFileSync('data.json')

let data = []
try {
    data = JSON.parse(data_file);
    } 
catch (error) {
    console.error('avi',error);
}



let arr_category = ['IAM', 'Logging', 'Monitoring', 'Networking', 'Kubernetes', 'General',
                    'Serverless', 'Elasticsearch', 'Storage', 'Secrets', 'Public', 'Vulnerabilities'
]
let arr_severity  = ['critical', 'high', 'medium', 'low']
let arr_status  = ['error', 'suppressed', 'passed']


function check_data(json)
{
    if (typeof(json) !== 'object')
    {
        return 'It is not a json format'
    }

    if (!json.hasOwnProperty('resource')      || 
        !json.hasOwnProperty('category')      ||
        !json.hasOwnProperty('creation_date') 
    )
    {
        return 'One (or more) of the keys - not found'
    }

    if (typeof(json['resource']) !== 'string')
    {
        return 'The resource is invalid'
    }
    
    if (!arr_category.includes(json['category']))
    {
        return 'The category is invalid'
    }

    if (!json.hasOwnProperty('errors'))
    {
        json['errors'] = '1'
    }

    else
    {
        if (json['errors'] === "" || json['errors'] === "''" || json['errors'] === '""')
        {
            json['errors'] = '1'
        }

        if (isNaN(json['errors']))
        {
            return 'The value in the errors-key is invalid'          
        }
    }

    if (!json.hasOwnProperty('details'))
    {
        data.push(json)
        return true
    }

    if (typeof(json['details']) === 'string')
    {
        json['details'] = JSON.parse(json['details'])
    }

    if (!arr_severity.includes(json['details']['severity']))
    {
        return 'The severity-key is not found'
    }

    if (!arr_status.includes(json['details']['status']))
    {
        return 'The status-key is not found'
    }

    for (i in json['details']['tags'])
    {
        if (typeof(json['details']['tags'][i]) !== 'object')
        {
            return 'One (or more) of the tags is invalid'
        }
    }

    data.push(json)    
    return true
}


function get_data(key ,value, field)
{
    if (field === '' && key === '')
    {
        return data
    }

    else if (field === '')
    {
        return data.filter(item => item[key] === value)
    }

    data.sort(function(a, b) {

        var nameA = a[field].toUpperCase();
        var nameB = b[field].toUpperCase();

        if (field === 'creation_date' || field === 'errors')
        {
            if (Number(nameA) < Number(nameB)) {
                return -1;
            }
            if (Number(nameA) > Number(nameB)) {
                return 1;
            }
            return 0;
        }

        else // if (field === 'resource' || field === 'category')
        {
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        }
    });

    if (key === '')
    {
        return data
    }

    return data.filter(item => item[key] === value)
}


app.post('/post_info', function (req, res){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')  
    res.send(check_data(req.query))
})

app.get('/get_info', function (req, res){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.send(get_data(req.query.key, req.query.value, req.query.field)) 
})

app.get('/get_info_all', function (req, res){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.send(data)
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
