const express = require("express");
const https = require("https"); // native to node
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/index.html");
})

app.post("/", function(req,res){
    console.log("Post request received");
    const query = req.body.city

    const apiKey = "[YOUR_KEY]";
    // https://openweathermap.org/current#name
    // API Call: https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units=metric"

    https.get(url,function(response){
        console.log(response.statusCode)
        response.on("data", function(data){
            // console.log(data) // return hexadecimal thing
            const weatherData = JSON.parse(data)
            const temperature = weatherData.main.temp
            const cityName = weatherData.name
            const weatherDesc = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const imageURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write("<p>The weather is currently "+weatherDesc+"</p>")
            res.write("<h1>The temperature in "+cityName+" is "+temperature+" degrees Celcius</h1>")
            res.write("<img src='"+imageURL+"'/>");
            res.send();
        })
    })
})

// const longitude = "-8.6524973";
// const latitude = "115.2191175";
// const apiKey = "be7693e26b1d1df725fd6531789958d0";

// app.get("/", function(req,res){
//     const apiKey = "be7693e26b1d1df725fd6531789958d0";
//     const city = "Denpasar"
//     // Get the Longitude and Latitude
//     const coordinatesUrl = "https://api.openweathermap.org/geo/1.0/direct?q="+city+"&appid="+apiKey
//     // to get coordinate from city name
//     // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    
//     https.get(coordinatesUrl,function(resp){
//         resp.on("data", function(d){
//             const longLatData = JSON.parse(d);
//             longitude = longLatData[0].lon
//             latitude = longLatData[0].lat
//             console.log("Status Coe of GeoCoding: "+resp.statusCode)
//             console.log("Longitude: "+longitude+" Latitude:"+latitude);
//         })
//     })
//     // res.sendFile(__dirname+"/index.html");
// });

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});
