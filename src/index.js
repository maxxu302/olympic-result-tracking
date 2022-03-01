import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import data from "../data/data";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
const app = express();
const {PORT = 3000} = process.env;

app.use(bodyParser.json()).use(cors());
app.get("/", (request, response) => response.send("Hello World UW restAPI"));

app.get("/api/v1/athletes", (req,res) => res.json(data.athletes));

app.get("/api/v1/sports", (req,res) => res.json(data.sports));
app.post("/api/v1/athletes", (req, res) => {
    const nextId = data.athletes.length+1;
    const athlete = {id:nextId, ...req.body};

    data.athletes.push(athlete);
    res.status(201).json(athlete);
})

app.get("/api/v1/results", (req, res) => {
    const {athleteid, sportid} = req.query;
    let results = data.results;

    if(athleteid) {
        results = results.filter(
            (result) => result.athleteid === parseInt(athleteid,10)
        );
    }
    if(sportid) {
        results = results.filter(
            (result) => result.sportid === parseInt(sportid, 10)
        );
    }
    return res.json(results);
});
app.get("/api/v1/athletes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const athlete = data.athletes.find((ath)=>ath.id===id);
    if (!athlete){
        return res.status(404).json({error: "Athlete not found"});
    }
    return res.json(athlete);
});

app.get("/api/v1/sports/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const sport = data.sports.find((spt)=>spt.id===id);
    if (!sport){
        return res.status(404).json({error: "Sport not found"});
    }
    return res.json(sport);
});

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(PORT, () => console.log(`Hello World, I am listening on port ${PORT}!`));