const express = require('express');
const userRouter = require('./routes/striming.routes');
const PORT = process.env.PORT || 8080;
const app = express();


app.use(express.json());
app.use('/', userRouter);

const start = () => {
    try {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start();
