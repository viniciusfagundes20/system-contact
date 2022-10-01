import express      from 'express';
import contactModel from '../models/contacts.js';
import phoneModel   from '../models/phone.js';

const app = express.Router();

app.get('/create', async(req, res) => {

    try
    {
        await contactModel.sync({ force: true });
        await phoneModel.sync({ force: true });

        res.json({
            status: 200,
            message: 'Database created successfully.'
        });
    }
    catch(ex)
    {
        res.json({
            status: 501,
            message: 'Ocorreu um erro: ' + ex.message
        });
    }

});

export default app;
