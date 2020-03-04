/////////////////////////////////////////////////////////////////////////////////////////
//
// File:   logger.js
// Author: Milko Anello
// Date:   01/03/2020
// Description: This module implements HTTP Server logging (access.log and error.log),
//              and server process logging. 
//
/////////////////////////////////////////////////////////////////////////////////////////

const m_Config = require('./configuration');

const m_Morgan = require('morgan');
const m_Winston = require('winston');
const m_Fs = require('fs');
const m_Path = require('path');

var m_Logger;

//---------------------------------------------------------------------------------------
function Initialize() {

    if (m_Logger) {
        return;
    }

    const LogFormat = m_Winston.format.combine(
        m_Winston.format.align(),
        m_Winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
        m_Winston.format.printf(info => `[${info.timestamp}][${info.level}] ${info.message}`)
    );

    const LogLevel = m_Config.LogLevel();
    var LogTransport;
    if (!LogLevel) {
        console.warn('Log Level is not defined');
    }

    var ProcessLog = m_Config.ProcessLog();
    if (!ProcessLog) {
        console.warn('Process Log is not defined');
    }
    else {
        if (ProcessLog === 'console') {
            var Colorize = m_Winston.format.colorize({ all: true });
            LogTransport = new m_Winston.transports.Console({ format: Colorize });
        }
        else {
            var Path = m_Path.join(__dirname, 'logs/' + ProcessLog);
            var Stream = m_Fs.createWriteStream(Path, { flags: 'a' });
            Stream.on('error', function(_Err) {
                console.error('Cannot initialize Application Log: ' + _Err);
                return null;
            });
            LogTransport = new m_Winston.transports.File({ stream: Stream });

        }
    }

    m_Logger = m_Winston.createLogger(
        {
            level: LogLevel,
            format: LogFormat,
            defaultMeta: { service: 'user-service' },
            transports: LogTransport
        }
    )

}

//---------------------------------------------------------------------------------------
function Write(_Level, _Message) {

    Initialize();
    m_Logger.log(_Level, _Message);

}

//---------------------------------------------------------------------------------------
function GetAccessLog() {

    var AccessLog = m_Config.AccessLog();

    const Moment = require('moment-timezone');
    m_Morgan.token('date', (_Req, _Res, _Timezone) => {
        return Moment().tz(_Timezone).format('DD/MM/YYYY HH:mm:ss');
    });
    var Timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    m_Morgan.format('MyCombined', '[:date[' + Timezone + ']] :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms');

    if (!AccessLog) {
        console.warn('Access Log is not defined');
    }
    else {
        if (AccessLog === 'console') {
            return m_Morgan('MyCombined');
        }
        else {
            if (AccessLog !== 'none') {
                var Path = m_Path.join(__dirname, 'logs/' + AccessLog);
                var Stream = m_Fs.createWriteStream(Path, { flags: 'a' });
                Stream.on('error', function(_Err) {
                    console.error('Cannot initialize Acess Log: ' + _Err);
                    return null;
                });
                return m_Morgan('MyCombined', { stream: Stream });
            }
        }
    }

    return null;

}

//---------------------------------------------------------------------------------------
function GetErrorLog() {

    var ErrorLog = m_Config.ErrorLog();

    const Moment = require('moment-timezone');
    m_Morgan.token('date', (_Req, _Res, _Timezone) => {
        return Moment().tz(_Timezone).format('DD/MM/YYYY HH:mm:ss');
    });
    var Timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    m_Morgan.format('MyCombined', '[:date[' + Timezone + ']] :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms');


    if (!ErrorLog) {
        console.warn('Access Log is not defined');
    }
    else {
        if (ErrorLog === 'console') {
            return m_Morgan('MyCombined', {
                skip: function (_Req, _Res) { return _Res.statusCode < 400 }
              });
        }
        else {
            if (ErrorLog !== 'none') {
                var Path = m_Path.join(__dirname, 'logs/' + ErrorLog);
                var Stream = m_Fs.createWriteStream(Path, { flags: 'a' });
                Stream.on('error', function(_Err) {
                    console.error('Cannot initialize Error Log: ' + _Err);
                    return null;
                });
                return m_Morgan('MyCombined', { skip: function (_Req, _Res) {
                                                    return _Res.statusCode < 400
                                              },
                                              stream: Stream
                                            });
            }
        }
    }

    return null;

}

module.exports.Error = 'error';
module.exports.Warn = 'warn';
module.exports.Info = 'info';
module.exports.Http = 'http';
module.exports.Verbose = 'verbose';
module.exports.Debug = 'debug';
module.exports.Silly = 'silly';

module.exports.Write = Write;
module.exports.AccessLog = GetAccessLog;
module.exports.ErrorLog = GetErrorLog;
