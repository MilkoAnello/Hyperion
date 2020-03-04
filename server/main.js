/////////////////////////////////////////////////////////////////////////////////////////
//
// File:   main.js
// Author: Milko Anello
// Date:   01/03/2020
// Description: Entry point of server process
//
/////////////////////////////////////////////////////////////////////////////////////////

const m_WebServer = require('./Services/web_server');
const m_OracleDB = require('./Services/oracle_db');
const m_Modules = require('./modules');
const m_Log = require('./logger');

const m_Path = require('path');

//---------------------------------------------------------------------------------------
async function LoadModules() {

    try {
        await m_Modules.Load();
        //m_Log.Write(m_Log.Debug, m_Modules.GetModuleName(0));
    }
    catch(_Err) {
        m_Log.Write(m_Log.Error, _Err);
        process.exit(1);
    }

}

//---------------------------------------------------------------------------------------
async function StartWebServer() {

    try {
        await m_WebServer.Start();
        m_Log.Write(m_Log.Info, 'Web server started on ' + m_WebServer.GetHostname() + ':' + m_WebServer.GetPort());
    }
    catch(_Err) {
        m_Log.Write(m_Log.Error, _Err);
        process.exit(1);
    }

}

//---------------------------------------------------------------------------------------
async function StartDatabase() {

    try {
        await m_OracleDB.Start();
        m_Log.Write(m_Log.Info, 'Oracle Database connection pool started');
    }
    catch(_Err) {
        m_Log.Write(m_Log.Error, _Err);
        process.exit(1);
    }

}

//---------------------------------------------------------------------------------------
async function OnShutdown(_Err) {

    let Err = _Err;
    m_Log.Write(m_Log.Info, 'Shutting down...');
   
    try {
        await m_WebServer.Stop();
        m_Log.Write(m_Log.Info, 'Web Server stopped');

    }
    catch (_Err) {
        m_Log.Write(m_Log.Error, _Err);
        Err = Err || _Err;
    }

    try {
        await m_OracleDB.Stop();
        m_Log.Write(m_Log.Info, 'Oracle Database connection pool stopped');

    }
    catch (_Err) {
        m_Log.Write(m_Log.Error, _Err);
        Err = Err || _Err;
    }

    m_Log.Write(m_Log.Info, 'Exiting process');
   
    if (Err) {
        process.exit(1);
    }
    else {
        process.exit(0);
    }

}

//---------------------------------------------------------------------------------------
process.on('SIGTERM', () => {

    m_Log.Write(m_Log.Debug, 'Received SIGTERM');
    OnShutdown();

});
   
//---------------------------------------------------------------------------------------
process.on('SIGINT', () => {

    m_Log.Write(m_Log.Debug, 'Received SIGINT');
    OnShutdown();

});
   
//---------------------------------------------------------------------------------------
process.on('uncaughtException', _Err => {

    m_Log.Write(m_Log.Err, 'Uncaught exception: ' + _Err);
    OnShutdown(_Err);

});

LoadModules();
StartWebServer();
StartDatabase();
