'use strict';
//
// This needs to be "objectified" so that config is persistent.
//
const apiKeys = {};
const keybug = require( "debug" )("keybug");

apiKeys.unauthRedirect = undefined;

apiKeys.keyFile = undefined;

apiKeys.keys = undefined;

apiKeys.apiKeyCheck = function ( req, res, next ) {
    keybug( "Query   : ", req.query );
    keybug( "Headers : ", req.headers );
    keybug( "list    : ", apiKeys.keys );
    let apiKey = req.query.apikey;                // Check query first
    if ( ! apiKey ) apiKey = req.headers.apikey;  // Then look in headers
    keybug( "apiKey provided: ", apiKey );
    if ( ! apiKey ) return res.redirect( apiKeys.unauthRedirect );
    const entry = apiKeys.keys.find( e => { return e.key === apiKey } );
    keybug( "Found   : ", entry );
    if ( ! entry || ! entry.user ) return res.redirect( apiKeys.unauthRedirect );
    if ( !req.body ) req.body = {};
    req.body.user = entry;
    next();
};

apiKeys.loadKeys = function( keyFile ) {
    apiKeys.keys = require( apiKeys.keyFile );
}

apiKeys.config = function( config ) {
    apiKeys.unauthRedirect = config.unauthRedirect;
    apiKeys.keyFile = config.keyFile;
    if ( apiKeys.keyFile ) apiKeys.loadKeys();
    return apiKeys.apiKeyCheck;
}

module.exports = apiKeys;
