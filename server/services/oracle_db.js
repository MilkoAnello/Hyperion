/////////////////////////////////////////////////////////////////////////////////////////
//
// File:   oracle_db.js
// Author: Milko Anello
// Date:   01/03/2020
// Description: Implementation of DB connect/disconnect and execution of queries for
//              REST Api. 
//
/////////////////////////////////////////////////////////////////////////////////////////

const m_Config = require('../configuration');
const m_Log = require('../logger');

const m_Oracle = require('oracledb')

var m_HRPool = {
    user: null,
    password: null,
    connectString: null,
    poolMin: 0,
    poolMax: 0,
    poolIncrement: 0
};

//---------------------------------------------------------------------------------------
async function Start() {

    m_HRPool.user = 'MILKO';
    m_HRPool.password = 'ncc1701';
    m_HRPool.connectString = 'PDB1';
    m_HRPool.poolMin = m_Config.OraclePoolMin();
    m_HRPool.poolMax = m_Config.OraclePoolMax();
    m_HRPool.poolIncrement = m_Config.OraclePoolIncrement();

    process.env.UV_THREADPOOL_SIZE = m_HRPool.poolMax + 4;

    const pool = await m_Oracle.createPool(m_HRPool);

}

//---------------------------------------------------------------------------------------
async function Stop() {

    await m_Oracle.getPool().close();

}

//---------------------------------------------------------------------------------------
function Execute(_Statement, _Binds = [], _Opts = {}) {

    return new Promise(async (_Resolve, _Reject) => {

        let Connection;
   
        _Opts.outFormat = m_Oracle.OBJECT;
        _Opts.autoCommit = true;
   
        try {
            Connection = await m_Oracle.getConnection();
            const Result = await Connection.execute(_Statement, _Binds, _Opts);
            _Resolve(Result);

        }
        catch (_Err) {
            _Reject(_Err);
        }
        finally {
            if (Connection) {
                try {
                    await Connection.close();
                }
                catch (_Err) {
                    m_Log.Write(m_Log.Error, _Err);
                }
            }
        }

    });

}

//---------------------------------------------------------------------------------------
module.exports.Start = Start;
module.exports.Stop = Stop;
module.exports.Execute = Execute;