/////////////////////////////////////////////////////////////////////////////////////////
//
// File:   index.js
// Author: Milko Anello
// Date:   01/03/2020
// Description: Implementation of routing for / request. 
//
/////////////////////////////////////////////////////////////////////////////////////////

var m_Router = require('express').Router();

const m_OracleDB = require('../services/oracle_db');

m_Router.get('/', async function(_Req, _Res, _Next) {
//  _Res.render('index', { title: 'Express' });
    const result = await m_OracleDB.Execute('select user, sysdate from dual');
    const user = result.rows[0].USER;
    const date = result.rows[0].SYSDATE;

    _Res.end(`DB user: ${user}\nDate: ${date}`);
});

module.exports = m_Router;
