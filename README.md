# html-fileuploader

## Implement Avatar Upload using FileUploader Plugin

For more details about the FileUploader Plugin, check https://innostudio.de/fileuploader/documentation/

# expo-io-maps-poc

## Requirements

1. Two tabs User Interface: maps tab and copy of a query sent to the data end-point on the second tab in json format
1. Tabs navigation bar is at the bottom of the screen
1. Must be an [expo.io](https://expo.io/) non-ejected project with a minimal number of artefacts in the project
1. Must be compatible with iOS and Android
1. Maps tab to center on the current user geo location
1. Please note: currently, the data is availalbe in Southern Ontario, Canada only
1. Maps tab is to display geoHash overlay based on geoHash query to the end-point mapping the Avg(***value***) NOT Sum(***count***)
1. User can scroll the map with overlay updated automatically
1. User can zoom in and out with increased/decreased precision of the data plotted on the map
1. Map dynamically adjusts the data ploted based on the zoom level and the current map center, e.g.:
![](./cropper.png)
1. Developer will address comments and issues reported
1. Developer will Walk thorugh the deliverables to explain the details and artefacts in the project

## Data End-Point

### geoHash Query

#### Request

```
curl -POST https://gsqztydwpe.execute-api.us-east-1.amazonaws.com/latest/geoHash \
  -H 'content-type:application/json' \
  -d '{
    "timestampMs": {
      "from": 1239065720835,
      "to": 1870217733565
    },
    "boundary": {
      "topLeft": {
        "lat": 44.56657,
        "lon": -81.916815
      },
      "bottomRight": {
        "lat": 42.697970000000005,
        "lon": -77.137755          
      }
    },
    "precision": 5,
    "timeoutMs": 30000
  }
'
```

#### Response

```
[
  {
    "location": {
      "lat": 43.85523071978241,
      "lon": -79.48322793468833
      },
    "geoPoint": "43.85523071978241,-79.48322793468833",
    "altitude": 225.7770164302664,
    "value": 527.5704404805242,
    "count": 5587,
    "valueRange": "high"
  },
  {
    "location": {
      "lat": 43.858659379184246,
      "lon": -79.48285175487399
    },
    "geoPoint": "43.858659379184246,-79.48285175487399",
    "altitude": 228.56340591995806,
    "value": 608.0557275541796,
    "count": 324,
    "valueRange": "medium"
  },
  {
    "location": {
      "lat": 43.84871001821011,
      "lon": -79.46083584800363
    },
    "geoPoint": "43.84871001821011,-79.46083584800363",
    "altitude": 197.15513499866833,
    "value": 169.5818181818182,
    "count": 165,
    "valueRange": "low"
  }
]
```

## How to submit your work

1. Fork the repo
1. Commit to your own repo
1. Submit a pull request for review and acceptance

