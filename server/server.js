import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/test", (request, response) => {
    response.send("Hello from server");
});


app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
