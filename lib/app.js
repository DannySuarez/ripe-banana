const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/v1/studios', require('./routes/studio'));
app.use('/api/v1/actors', require('./routes/actors'));
app.use('/api/v1/films', require('./routes/films'));
app.use('/api/v1/reviewer', require('./routes/reviewer'));
app.use('/api/v1/reviews', require('./routes/reviews'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
