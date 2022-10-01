import express          from 'express';
import contactModel     from '../models/contacts.js';
import phoneModel       from '../models/phone.js';
import dbConnection     from '../factory/db-connection.js';
import Navegator        from '../features/navegator.js';
import ClsLog           from '../factory/clsLog.js';
import { TypeLogs }     from '../factory/clsLog.js';
import { QueryTypes }   from 'sequelize';

const app = express.Router();

app.get('/edit/:id', async(req, res) => {

    const id = parseInt(req.params.id);

    if(!id)
    {
        res.redirect('/contact/list');
        return;
    }

    let contact = await phoneModel.findOne({
        include: {
            model: contactModel,
            required: true
        },
        where: {
            id: id
        }
    });

    if(!contact)
    {
        res.redirect('/contact/list');
        return;
    }

    res.render('edit', {
        title: 'Novo registro',
        contact: contact
    });

});


app.post('/edit', async(req, res) => {

    let data = req.body;

    if(!data.id || !data.nome || !data.telefone)
    {
        res.json({
            success: false,
            message: '## ERROR_BAD_REQUEST ##'
        });
        return;
    }

    const vTransaction = await dbConnection.transaction();

    try
    {
        const phoneNumber = await phoneModel.findByPk(parseInt(data.id));

        if(!phoneNumber)
        {
            res.status(400);
            res.json({
                success: false,
                message: '## ERROR_NOT_FOUND ##'
            });
            return;
        }

        phoneNumber.NUMERO = data.telefone;

        await phoneNumber.save({
            transaction: vTransaction
        });

        const contact = await contactModel.findByPk(phoneNumber.IDCONTATO);

        contact.NOME = data.nome;
        contact.IDADE = parseInt(data.idade);

        await contact.save({
            transaction: vTransaction
        });

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

app.get('/register', async(req, res) => {

    res.render('register', {
        title: 'Novo registro'
    });

});


app.post('/register', async(req, res) => {

    let data = req.body;
    let numbers = JSON.parse(req.body.phones);

    if(!data.name)
    {
        res.json({
            success: false,
            message: 'O campo nome precisa ser preenchido!'
        });
        return;
    }

    for(let i = 0; i < numbers.length; i++) {

        if(!numbers[i]) {
            res.json({
                success: false,
                message: 'Existe(m) campo(s) de telefone que precisa(m) ser(em) preenchido(s)!'
            });
            return;
        }

    }

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

            if(!numbers[i]) {
                continue;
            }

            await phoneModel.create({
                IDCONTATO: parseInt(contact.id),
                NUMERO: numbers[i].toString()
            },
            {
                transaction: vTransaction
            });

            ClsLog.create(`Foi incluído um contato`, TypeLogs.Info);

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


app.get('/list/:page?', async (req, res) => {

    const limit      = 30;
    const records    = await phoneModel.count();
    const pageNumber = Navegator.getNumberParam(req.params.page);
    const pages      = Navegator.getPages(records, limit);
    const offset     = Navegator.getOffset(pageNumber, limit)

    try
    {
        const contacts = await
        phoneModel.findAll({
            include: [{
                model: contactModel,
                required: true
            }],
            limit: limit,
            offset: offset
        });


        res.render('list',{
            title: 'Lista de contatos',
            contacts: contacts,
            pages: pages,
            page: pageNumber,
            link: '/contact/list'
        });

    }
    catch(ex)
    {
        res.json({
            status: 401,
            message: ex.message
        });
    }


});

app.get('/find', async(req, res) => {

    const data  = req.query;
    const limit = 30;

    try
    {
        let contacts =
        await dbConnection.query(`
            SELECT
                telefones.id,
                telefones.NUMERO,
                contatos.NOME,
                telefones.createdAt
            FROM telefones
            INNER JOIN contatos ON
            contatos.id = telefones.IDCONTATO
            WHERE
            contatos.NOME LIKE :nome
            OR telefones.NUMERO LIKE :numero
            LIMIT :limit
        `, {
            replacements: {
                nome: `%${data.name}%`,
                numero: `%${data.number}%`,
                limit: limit
            },
            type: QueryTypes.SELECT
          });

        res.render('find',{
            title: 'Lista de contatos',
            contacts: contacts
        });

    }
    catch(ex)
    {
        res.json({
            status: 401,
            message: ex.message
        });
    }

});

app.post('/delete', async(req, res) => {

    const id = parseInt(req.body.id);

    if(!id)
    {
        res.status(401);
        res.json({
            success: false,
            message: '## ERROR_BAD_REQUEST ##',
        });
        return;
    }

    try
    {

        const phoneNumber = await phoneModel.findByPk(id);

        if(!phoneNumber)
        {
            res.status(404);
            res.json({
                success: false,
                message: '## ERROR_NOT_RECORD ##',
            });
            return;
        }

        await phoneNumber.destroy();
        ClsLog.create(`Foi excluído um contato (${id})`, TypeLogs.Alert);

        res.status(200);
        res.json({
            success: true,
            message: 'Registro foi excluído com sucesso.',
        });
        return;

    }
    catch(ex)
    {

        res.status(401);
        res.json({
            success: false,
            message: '## ERROR_PROCESS_OP ##',
        });
        return;

    }

});

export default app;
