var pronounceable = require('pronounceable');
var express = require('express')  
var app = express()  
var bodyParser = require('body-parser')


app.set('view engine', 'pug')   
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/', function (req, res) {  
    res.render( 'index' )
    // console.log(pronounceable.score('saket'))
})
app.get('/list', function(req, res) {
    res.render('list')
})
app.get('/listtolist', function (req, res) {
    res.render('listtolist')
})
app.post('/plz', [shipify])
function shipify(req, res) {
    // console.log(req.body)
    console.log(req.body.name1)
    var name1 = req.body.name1
    console.log(pronounceable.score(name1))
    console.log(req.body.name2)
    var name2 = req.body.name2
    console.log(pronounceable.score(name2))
    var best_ship = gen_ship(name1, name2).b_s
    console.log(best_ship)
    res.render('result', {ship_value: best_ship})
    res.end();
}
function gen_ship(name1, name2){
    var combined_length = (name1.length + name2.length) / 2
    var ships = []
    for (var i = 1; i < name1.length; i++){
        var part_1 = name1.slice(0, i)
        for (var j = 1; j < name2.length; j++){
            ships.push(part_1 + name2.slice(j, name2.length))
        }
    }
    for (var i = 1; i < name2.length; i++){
        var part_1 = name2.slice(0, i)
        for (var j = 1; j < name1.length; j++){
            ships.push(part_1 + name1.slice(j, name1.length))
        }
    }
    var best_ship = "";
    var easiest = 0;
    for (var j = 0; j < ships.length; j++){
        var score = pronounceable.score(ships[j]) + 2/(Math.abs(combined_length - ships[j].length) + 1);
        if(score > easiest){
            best_ship = ships[j]
            easiest = score
        }
    }
    return {b_s: best_ship, score: easiest}
}

app.post('/listfind', [listfunc])
function listfunc(req, res) {
    // console.log(req.body)
    // console.log(req.body.namef)
    var name1 = req.body.namef
    // console.log(pronounceable.score(name1))
    // console.log(req.body.names)
    var names = req.body.names
    var ship_string = gen_ship_string(name1, names)
    res.render('resultlist', {ship_value: ship_string, name:name1})
    res.end();
}
app.post('/listtolistfind', [listtolist])
function listtolist (req, res) {
    var names1 = req.body.names1.split(",")
    var names2 = req.body.names2
    // console.log(names1)
    // console.log(names2)
    var best_score = 0;
    var best_ship = "";
    for (var i = 0; i < names1.length; i++) {
        // console.log(names1[i])
        var ship_str = gen_ship_string(names1[i], names2)
        // console.log('ship_str')
        // console.log(ship_str)
        var score = ship_str['Best:'].split(" - ")[1]
        if (score > best_score) {
            best_score = score;
            var best = ship_str['Best:'].split('Best ship:')[1]
            best_ship = "Best ship: " + names1[i] + " + " + best;
        }
    }
    res.render('resultlisttolist', {ship: best_ship})
    res.end();
}
function gen_ship_string(name1, names){
    var name_list = names.split(",")
    var ship_string = {}
    var best_ship = "";
    var best_score = 0;
    var best_name = "";
    for (var i = 0; i < name_list.length; i++){
        var name2 = name_list[i]
        var result = gen_ship(name1, name2)
        var score = result.score
        ship_string[name2] = name2 + ": " + result.b_s + ' - ' + score
        if (score > best_score) {
            best_score = score;
            best_ship = result.b_s;
            best_name = name2
        }
    }
    ship_string['Best:'] =  "Best ship: " + best_name + ' -> ' + best_ship + ' - ' + best_score
    // console.log(ship_string)
    return ship_string
}
app.listen(3000, function () {  
    console.log('Example app listening on port 3000!')
})