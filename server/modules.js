/////////////////////////////////////////////////////////////////////////////////////////
//
// File:   modules.js
// Author: Milko Anello
// Date:   01/03/2020
// Description: This module implements funtionalities for loading modules at run time. 
//
/////////////////////////////////////////////////////////////////////////////////////////

const m_FS = require('fs');
const m_Path = require('path');

var m_ModuleHolder = [];

//---------------------------------------------------------------------------------------
function OnLoad(_Resolve, _Reject) {

    var Index = 0;
    const Dir = m_Path.join(__dirname, 'modules');

    m_FS.readdir(Dir, function(_Err, _Files) {

        if (_Err) {
            _Reject(_Err);
        }
        else {
            _Files.forEach(function(_File) {
                m_ModuleHolder[Index] = require(m_Path.join(Dir, _File));
                Index++;
            });
            _Resolve();
        }

    })

}

//---------------------------------------------------------------------------------------
async function Load() {

    return new Promise(OnLoad);

}

//---------------------------------------------------------------------------------------
function GetModuleName(_Index) {

    return m_ModuleHolder[_Index]['Name'];

}

//---------------------------------------------------------------------------------------
module.exports.Load = Load;
module.exports.GetModuleName = GetModuleName;
