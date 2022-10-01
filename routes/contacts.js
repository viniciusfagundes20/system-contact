import express      from 'express';
import contactModel from '../models/contacts.js';
import phoneModel   from '../models/phone.js';
import dbConnection from '../factory/db-connection.js';


const app = express.Router();

app.get('/register', async(req, res) => {

    res.render('register', {
        title: 'Novo registro'
    });

});


app.post('/register', async(req, res) => {

    let data = req.body;
    let numbers = JSON.parse(req.body.phones);

    const vTransaction = await dbConnection.transaction();
    const contact = await contactModel.build();

    try
    {
        contact.NOME = data.name;

        if(data.age)
        {
            contact.IDADE = parseInt(data.age);
        }

        await contact.save({
            transaction: vTransaction
        });

        for(let i = 0; i < numbers.length; i++) {

            await phoneModel.create({
                IDCONTATO: parseInt(contact.id),
                NUMERO: numbers[i].toString()
            },
            {
                transaction: vTransaction
            });

        }

        await vTransaction.commit();

        res.json({
            success: true,
            message: 'Registrado com sucesso!'
        });

    }
    catch(ex)
    {
        vTransaction.rollback();
        res.json({
            success: false,
            message: ex.message
        })
    }


});

export default app;
