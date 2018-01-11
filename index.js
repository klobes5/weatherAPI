import express from 'express'
import { json as parseJsonBody } from 'body-parser';

const server = express();
export default server;
const validate = require('express-validation');
const validation = require('./validation/measurements.js');
var isBefore = require('date-fns/is_before');
var isAfter = require('date-fns/is_after');
var isDate = require('date-fns/is_date');
var parse = require('date-fns/parse');

var sarahMeasurements = {};//will hold all measurements until program memory is released
/*
  TODO: Implement the endpoints in the ATs.
  The below stubs are provided as a starting point.
  You may refactor them however you like, so long as the default export of
  this file is the root request handler (i.e. `express()`).
*/

// all requests and responses are in JSON
server.use(parseJsonBody());
// dummy handler so you can tell if the server is running
// e.g. `curl localhost:8000`
server.get('/', (req, res) => res.send('Weather tracker is up and running!\n'));
//error handler
server.use(function(err, req, res, next){
  res.sendstatus(400);
});
// features/01-measurements/01-add-measurement.feature
server.post('/measurements', validate(validation.add), (req, res) => {
    
    var timestamp = req.body.timestamp, temperature = req.body.temperature, dewPoint = req.body.dewPoint, precipitation = req.body.precipitation, data = {};
    data.timestamp = timestamp;
    if(temperature) data.temperature = temperature;
    if(dewPoint) data.dewPoint = dewPoint;
    if(precipitation || precipitation === 0) data.precipitation = precipitation;
    sarahMeasurements[data['timestamp']] = data;
    //console.log(sarahMeasurements);
    res.location('/measurements/' + req.body.timestamp);//set location header path
    res.sendStatus(201); //success
});

// features/01-measurements/02-get-measurement.feature
server.get('/measurements/:timestamp', validate(validation.get), (req, res) => {
//server.get('/measurements/:timestamp', (req, res) => {
    var timestamp = req.params.timestamp, data = [], baseTime;
    if(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}\.[0-9]{3}Z/.test(timestamp)){
        //console.log('we are returning 1 set of measurements');
        data = sarahMeasurements[timestamp];
        if(data){
            res.status(200).send(data);
            
        }else{
            res.sendStatus(404);
            return;
        }
    }else{
        //console.log('we are potentially returning multiple sets of measurements');
        baseTime = timestamp.slice(0, 10)
        //console.log("newtime is: ", baseTime);
        for (var key in sarahMeasurements){
            if(key && key.slice(0, 10) == baseTime){
                data.push(sarahMeasurements[key]);
            }
        }
        if(data.length > 0){
            res.status(200).send(data);
        }else{
            res.sendStatus(404);
        }
        //console.log("Data is: ", data);
    }
  //res.sendStatus(501); // not implemented
});

// features/01-measurements/03-update-measurement.feature
server.put('/measurements/:timestamp', validate(validation.update), (req, res) => {
    var timestamp = req.params.timestamp, data, replacement = {}, temperature,dewPoint,precipitation;
    data = sarahMeasurements[timestamp];

    if(data && req.params.timestamp == req.body.timestamp){
        
        replacement.timestamp = timestamp;
        temperature = req.body.temperature;
        dewPoint = req.body.dewPoint;
        precipitation = req.body.precipitation;
        
        if(temperature) replacement.temperature = temperature;
        if(dewPoint) replacement.dewPoint = dewPoint;
        if(precipitation || precipitation === 0) replacement.precipitation = precipitation;
        
        sarahMeasurements[replacement['timestamp']] = replacement;
        res.sendStatus(204);
        
    }else if(data && req.params.timestamp != req.body.timestamp){
        res.sendStatus(409); //mismatched timestamps
    }else{
        res.sendStatus(404); //measurement does not exist
    }
  /* Example:
  assert.equal(req.params.timestamp, '2015-09-01T16:00:00.000Z');

  assert.deepEqual(res.body, {
    timestamp: '2015-09-01T16:00:00.000Z',
    temperature: 27.1,
    dewPoint: 16.7,
    precipitation: 15.2
  });
  */
  //res.sendStatus(501); // not implemented
});

// features/01-measurements/03-update-measurement.feature
server.patch('/measurements/:timestamp', validate(validation.patch), (req, res) => {
    var timestamp = req.params.timestamp, data;
    data = sarahMeasurements[timestamp];
    
    if(data && req.params.timestamp == req.body.timestamp){
        var replacement = {
            'timestamp': data.timestamp,
            'temperature': req.body.temperature || data.temperature,
            'dewPoint': req.body.dewPoint || data.dewPoint,
            'precipitation': req.body.precipitation || data.precipitation
        };
        sarahMeasurements[replacement['timestamp']] = replacement;
        res.sendStatus(204); //update with valid values
    }else if(data && req.params.timestamp != req.body.timestamp){
      res.sendStatus(409); //mismatched timestamps
    }else{
       res.sendStatus(404); //measurements do not exist
    }
  /* Example:
  assert.equal(req.params.timestamp, '2015-09-01T16:00:00.000Z');
  assert.deepEqual(res.body, {
    timestamp: '2015-09-01T16:00:00.000Z',
    precipitation: 15.2
  });
  */
  //res.sendStatus(501); // not implemented
});

// features/01-measurements/04-delete-measurement.feature
server.delete('/measurements/:timestamp', validate(validation.delete), (req, res) => {
    var timestamp = req.params.timestamp, data;
    data = sarahMeasurements[timestamp];
    if(data){
       delete sarahMeasurements[timestamp];
       res.sendStatus(204); //successfully deleted measurement
    }else{
       res.sendStatus(404); //measurement not found
    }
  /* Example:
  assert.equal(req.params.timestamp, '2015-09-01T16:20:00.000Z');
  */
  //res.sendStatus(501); // not implemented
});

// features/02-stats/01-get-stats.feature
server.get('/stats', (req, res) => {
    var querystat = req.query.stat, querymetric = req.query.metric, stats = [], metrics = [], results = [], value, data = {};
    //console.log(querystat);
    //console.log(querymetric);
    if(!Array.isArray(querystat)){
        stats[0] = querystat;
    }else{
        stats = querystat;
    }
    if(!Array.isArray(querymetric)){
        metrics[0] = querymetric;
    }else{
        metrics = querymetric;
    }
    console.log("stats are: ", stats);
    console.log("metrics are: ", metrics);
    for (var i=0, statlen=stats.length; i < statlen; i++){
        for(var j=0, metriclen=metrics.length; j < metriclen; j++){
            //console.log("stat is: ", stats[i]);
            switch(stats[i]){
                case 'min':
                    //console.log("fromDateTime in case is: ", req.query.fromDateTime);
                    data = {};
                    data.metric = metrics[j];
                    data.stat = stats[i];
                    data.value = parseFloat(getMin(req.query.fromDateTime, req.query.toDateTime, metrics[j]).toFixed(1));
                    //console.log("data.value is: " +data.value);
                    if(!isNaN(data.value) && isFinite(data.value)) results.push(data);
                    break;
                case 'max':
                    data = {};
                    data.metric = metrics[j];
                    data.stat = stats[i];
                    data.value = parseFloat(getMax(req.query.fromDateTime, req.query.toDateTime, metrics[j]).toFixed(1));
                    //console.log("data.value is: " + data.value);
                    if(!isNaN(data.value) && isFinite(data.value)) results.push(data);
                    break;
                case 'average':
                    data = {};
                    data.metric = metrics[j];
                    data.stat = stats[i];
                    data.value = parseFloat(getAverage(req.query.fromDateTime, req.query.toDateTime, metrics[j]).toFixed(1));
                    //console.log("data.value is: " + data.value);
                    if(!isNaN(data.value) && isFinite(data.value)) results.push(data);
                    break;
            }

        }
    }
    results.sort(function(a, b){ return metrics.indexOf(a.metric) - metrics.indexOf(b.metric) });
    console.log("results are: ", results);
    //Get stats for a well-reported metric
    res.status(200).send(results);
    
  /* Example:
    assert.deepEqual(req.query.metric, [
      'temperature',
      'dewPoint'
    ]);

    assert.deepEqual(req.query.stat, [
      'min',
      'max'
    ]);
    res.send([
      {
        metric: 'temperature',
        stat: 'min'
        value: 27.1
      },
      {
        metric: 'temperature',
        stat: 'max'
        value: 27.5
      },
      {
        metric: 'dewPoint',
        stat: 'min'
        value: 16.9
      },
      {
        metric: 'dewPoint',
        stat: 'max'
        value: 17.3
      }
    ]);
  */
  //res.sendStatus(501); // not implemented
});
function getMin(fromDateTime, toDateTime, metric){
    var values = [], from = parse(fromDateTime), to = parse(toDateTime), date;
    for (var key in sarahMeasurements){
        date = parse(key);
        if((isAfter(date, from) || isDate(date,from)) && isBefore(date, to)){
            values.push(sarahMeasurements[key][metric]);
        }
    }
    values = values.filter(function(number){ return number != undefined});
    console.log("Min values are: ", values);
    return Math.min(...values);
}
function getMax(fromDateTime, toDateTime, metric){
    var values = [],from = parse(fromDateTime), to = parse(toDateTime), date;
    for (var key in sarahMeasurements){
        date = parse(key);
        if((isAfter(date, from) || isDate(date, from)) && isBefore(date, to)){
            values.push(sarahMeasurements[key][metric]);
        }
    }
    values = values.filter(function(number){ return number != undefined});
    console.log("Max values are: ", values);
    return Math.max(...values);
}
function getAverage(fromDateTime, toDateTime, metric){
    var values = [], sum = 0, max = 0, from = parse(fromDateTime), to = parse(toDateTime), date;
    for (var key in sarahMeasurements){
        date = parse(key);
        if((isAfter(date, from) || isDate(date, from)) && isBefore(date, to)){
            values.push(sarahMeasurements[key][metric]);
        }
    }
    values = values.filter(function(number){ return number != undefined});
    max = values.length;
    console.log("Average values are: ", values);
    for(var i = 0; i < max; i++){
        sum += values[i];
    }
    console.log("Sum is: ", sum);
    return sum / max;
}
