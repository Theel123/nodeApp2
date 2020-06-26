module.exports = (app) => {

    //rota para listar pagamentos

    app.get('/pagamentos', (req, res) => {
        console.log('Recebida requisicao de teste na porta 3000.')
        res.send('OK.');
    });

    //rota para confirmar pagamento

    app.put('/pagamentos/pagamento/:id', (req, res) => {

        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CONFIRMADO';

        var connection = app.model.connectionFactory();
        var pagamentoDao = new app.model.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, (erro) => {
            if (erro){
                res.status(500).send(erro);
            }
            res.send(pagamento);
        });
    });

    // rota para cancelar pagamento

    app.delete('/pagamentos/pagamento/:id', (req, res) => {

        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CANCELADO';

        var connection = app.model.connectionFactory();
        var pagamentoDao = new app.model.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, (erro) => {
            if (erro){
                res.status(500).send(erro);
            }
            console.log('pagamento cancelado');
            res.status(204).send(pagamento);
        });

    });

    //rota para inserir pagamentos

    app.post('/pagamentos/pagamento', (req, res) => {

        req.assert("forma_de_pagamento", "Forma de pagamento eh obrigatorio").notEmpty();
        req.assert("valor", "Valor eh obrigatorio e deve ser um decimal").notEmpty().isFloat();

        var erros = req.validationErrors();

        if (erros){
            console.log('Erros de validacao encontrados');
            res.status(400).send(erros);
            return;
        }

        var pagamento = req.body;
        console.log('processando uma requisicao de um novo pagamento');

        pagamento.status = 'CRIADO';
        pagamento.data = new Date;

        var connection = app.model.connectionFactory();
        var pagamentoDao = new app.model.PagamentoDao(connection);

        pagamentoDao.salva(pagamento, (erro, resultado) => {
            if(erro){
                console.log('Erro ao inserir no banco:' + erro);
                res.status(500).send(erro);
            } else {
                pagamento.id = resultado.insertId;
                console.log('pagamento criado');
                res.location('/pagamentos/pagamento/' + pagamento.id);

                var response = {
                  dados_do_pagamento: pagamento,
                  links: [
                    {
                      href:   "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                      rel:    "confirmar",
                      method: "PUT"
                    },
                    {
                      href:   "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                      rel:    "cancelar",
                      method: "DELETE"

                    }
                  ]
                }

                res.status(201).json(response);
            }
        });

    });
}
