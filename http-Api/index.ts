import express from "express"
import { globalRouter } from "./routes/order";


const app = express();

app.use(express.json());

app.use("/api/v1", globalRouter);


app.listen(3001, () => {
    console.log("i am listening on port 3001");
})