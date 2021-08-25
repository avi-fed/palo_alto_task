const fs = require("fs");
const express = require('express');
const app = express()
const port = 8080



let data = [
    {
        "resource": "aws_s3_bucket",
        "category": "Storage",
        "errors": "14",
        "creation_date": "1628406616705",
        "details": {
            "severity": "low",
            "status": "error",
            "tags": [{"name":"application_bucket"}, {"size":"10GB"}, {"region": "us_west_2"}]
        }
    },
    {
        "resource": "aws_api_gateway_api_key",
        "category": "Storage",
        "errors": "7",
        "creation_date": "1628406236705",
        "details": {
            "severity": "high",
            "status": "error",
            "tags": [{"name":"application_bucket"}, {"size":"10GB"}, {"region": "us_west_2"}]
        }
    },
    {
        "resource": "aws_s3_bucket_storage",
        "category": "Storage",
        "errors": "3",
        "creation_date": "1628406236725",
        "details": {
            "severity": "low",
            "status": "passed",
            "tags": [{"name":"application_bucket"}, {"size":"10GB"}, {"region": "us_west_2"}]
        }
    },
    {
        "resource": "aws_acm_certificate_validation",
        "category": "Logging",
        "errors": "14",
        "creation_date": "1628406236725",
        "details": {
            "severity": "high",
            "status": "error",
            "tags": [{"name":"application_bucket"}, {"size":"10GB"}, {"region": "us_west_2"}]
        }
    },
    {
        "resource": "aws_acm_certificate_validation",
        "category": "Secrets",
        "errors": "14",
        "creation_date": "1628406236725",
        "details": {
            "severity": "high",
            "status": "error",
            "tags": [{"type":"super secret secret"}, {"region": "us_west_2"}]
        }
    },
    {
        "resource": "aws_api_gateway_authorizer",
        "category": "Networking",
        "errors": "45",
        "creation_date": "1628406236725",
        "details": {
            "severity": "high",
            "status": "suppressed",
            "tags": [{"name":"application_bucket"},  {"region": "us_west_2"}]
        }
    },
    {
        "resource": "aws_api_gateway_documentation_part",
        "category": "Vulnerabilities",
        "errors": "17",
        "creation_date": "1638406236725",
        "details": {
            "severity": "high",
            "status": "error",
            "tags": [{"name":"application_bucket"}, {"tag":"this is a private documentation that is secret"},  {"region": "us_west_2"}]
        }
    },
    {
        "resource": "aws_api_gateway_domain_name",
        "category": "Networking",
        "errors": "20",
        "creation_date": "1438406236725",
        "details": {
            "severity": "high",
            "status": "error",
            "tags": [{"name":"application_bucket"}, {"tag":"this is a private documentation that is secret"},  {"region": "us_west_2"}]
        }
    },
    {
        "resource": "aws_api_gateway_method_settings",
        "category": "General",
        "errors": "5",
        "creation_date": "1638406232725",
        "details": {
            "severity": "high",
            "status": "error",
            "tags": [{"name":"application_bucket"}, {"tag":""},  {"region": "us_west_2"}]
        }
    }
]


let arr_category = ['IAM', 'Logging', 'Monitoring', 'Networking', 'Kubernetes', 'General',
                    'Serverless', 'Elasticsearch', 'Storage', 'Secrets', 'Public', 'Vulnerabilities'
]
let arr_severity  = ['critical', 'high', 'medium', 'low']
let arr_status  = ['error', 'suppressed', 'passed']

function isNumeric(string_number)
{
    return !isNaN(string_number)
}

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
        return 'The category-key is not found'
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

        if (!isNumeric(json['errors']))
        {
            return 'The value at the errors-key is invalid'          
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

function get_data()
{
    return data
}

app.post('/post_info', function (req, res){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')  
    res.send(check_data(req.query))
})

app.get('/get_info', function (req, res){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')  
    res.send(get_data())
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
