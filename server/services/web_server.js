/////////////////////////////////////////////////////////////////////////////////////////
//
// File:   http_server.js
// Author: Milko Anello
// Date:   01/03/2020
// Description: This module implements HTTP Server functionalities. 
//
/////////////////////////////////////////////////////////////////////////////////////////

const m_Config = require('../configuration');
const m_Log = require('../logger');
var m_IndexRouter = require('../routes/index');

const m_Http = require('http');
const m_Express = require('express');
const m_Path = require('path');
var m_CookieParser = require('cookie-parser');

var m_App;
var m_Server;

//---------------------------------------------------------------------------------------
function NormalizePort(_Port) {

    var Port = parseInt(_Port, 10);
  
    if (isNaN(Port)) {
      return _Port;
    }
  
    if (Port >= 0) {
      return Port;
    }
  
    return false;

}

//---------------------------------------------------------------------------------------
async function OnStart(_Resolve, _Reject) {

    m_App = m_Express();

    m_App.use(m_Log.AccessLog());
    m_App.use(m_Log.ErrorLog());

    m_App.use(m_Express.json());
    m_App.use(m_Express.urlencoded({ extended: false }));
    m_App.use(m_CookieParser());
    //m_App.use(m_Express.static(m_Path.join(__dirname, '../public')));
    
    m_App.use('/', m_IndexRouter);

    var Port = NormalizePort(m_Config.Port());
    var Hostname = m_Config.Hostname();
    m_App.set('port', Port);
    m_App.set('hostname', Hostname);

    m_Server = m_Http.createServer(m_App);

    m_Server.listen(Port, Hostname)
        .on('listening', () => { _Resolve(); })
        .on('error', _Err => { _Reject(_Err); });

}

//---------------------------------------------------------------------------------------
async function OnStop(_Resolve, _Reject) {

    m_Server.close((_Err) => {
        if (_Err) {
            _Reject(_Err);
        }
        else {
            _Resolve();
        }
    });

}

//---------------------------------------------------------------------------------------
async function Start() {

    return new Promise(OnStart);

}

//---------------------------------------------------------------------------------------
async function Stop() {

    return new Promise(OnStop);

}

//---------------------------------------------------------------------------------------
function GetHostname() {

    return m_App.get('hostname');

}

//---------------------------------------------------------------------------------------
function GetPort() {

    return m_App.get('port');

}

//---------------------------------------------------------------------------------------
module.exports.Start = Start;
module.exports.Stop = Stop;
module.exports.GetHostname = GetHostname;
module.exports.GetPort = GetPort;