/////////////////////////////////////////////////////////////////////////////////////////
//
// File:   configuration.js
// Author: Milko Anello
// Date:   01/03/2020
// Description: Utility functions for reading server configuration. 
//
/////////////////////////////////////////////////////////////////////////////////////////

const m_PropertiesReader  = require('properties-reader');
const m_Path = require('path');
var m_Properties = null;

//---------------------------------------------------------------------------------------
function Initialize() {

    if (!m_Properties) {
        m_Properties = m_PropertiesReader(m_Path.join(__dirname, 'config/server.conf'));
    }

}

//---------------------------------------------------------------------------------------
function GetHostname() {

    Initialize();

    return m_Properties.get('HTTP.hostname');

}

//---------------------------------------------------------------------------------------
function GetPort() {

    Initialize();

    return m_Properties.get('HTTP.port');

}

//---------------------------------------------------------------------------------------
function GetAccessLog() {

    Initialize();

    return m_Properties.get('LOGGING.access_log');

}

//---------------------------------------------------------------------------------------
function GetErrorLog() {

    Initialize();

    return m_Properties.get('LOGGING.error_log');

}

//---------------------------------------------------------------------------------------
function GetProcessLog() {

    Initialize();

    return m_Properties.get('LOGGING.process_log');

}

//---------------------------------------------------------------------------------------
function GetLogLevel() {

    Initialize();

    return m_Properties.get('LOGGING.log_level');

}

//---------------------------------------------------------------------------------------
function GetOraclePoolMin() {

    Initialize();

    return m_Properties.get('ORACLE.pool_min');

}

//---------------------------------------------------------------------------------------
function GetOraclePoolMax() {

    Initialize();

    return m_Properties.get('ORACLE.pool_max');

}

//---------------------------------------------------------------------------------------
function GetOraclePoolIncrement() {

    Initialize();

    return m_Properties.get('ORACLE.pool_increment');

}

module.exports.Hostname = GetHostname;
module.exports.Port = GetPort;
module.exports.AccessLog = GetAccessLog;
module.exports.ErrorLog = GetErrorLog;
module.exports.ProcessLog = GetProcessLog;
module.exports.LogLevel = GetLogLevel;
module.exports.OraclePoolMin = GetOraclePoolMin;
module.exports.OraclePoolMax = GetOraclePoolMax;
module.exports.OraclePoolIncrement = GetOraclePoolIncrement;