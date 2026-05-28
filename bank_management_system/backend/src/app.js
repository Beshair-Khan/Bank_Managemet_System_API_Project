const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const app     = express();

app.use(helmet());
app.use(cors({origin:'*'}));
app.use(express.json());
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Welcome to the Bank Management System API' });
});
app.use('/api/customers',     require('./routes/customers'));
app.use('/api/accounts',      require('./routes/accounts'));
app.use('/api/transactions',  require('./routes/transactions'));
app.use('/api/loans',         require('./routes/loans'));
app.use('/api/cards',         require('./routes/cards'));
app.use('/api/employees',     require('./routes/employees'));
app.use('/api/branches',      require('./routes/branches'));
app.use('/api/notifications', require('./routes/notifications'));

app.use(require('./middleware/errorhandler'));

module.exports = app;