const express = require('express');
const app = express();
const routes = require('./routes');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/api/v1', routes);

app.listen(3000, () => {
    console.log('Server running on port 3000...');
});