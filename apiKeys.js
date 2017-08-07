'use strict';
//
// apiKeys.js - validate an API key provided in an http query or header against a json list of keys.
//
// example usage:
// const apiKeyCheck = require( "./apiKeys.js" ).config( { unauthRedirect: "/unauthorized", keyFile: "./keys.js" } );
//
// app.get( "/v1/api", apiKeyCheck, function( req, res ) { ... } );
//
// Note: for debugging use DEBUG=keybug
//
const apiKeys = {};
const keybug = require( "debug" )("keybug");
//
// unauthRedirect and keyfile are set by apiKeys.config.
//
apiKeys.unauthRedirect = undefined;

apiKeys.keyFile = undefined;
//
// Keys is a list of keys loaded from keyFile in the config call.
//
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
//
// Sets config parameters and loads the keyfile from apiKeys.keyFile.
// returns apiKeys.apiKeyCheck for use as middleware
//
apiKeys.config = function( config ) {
    apiKeys.unauthRedirect = config.unauthRedirect;
    apiKeys.keyFile = config.keyFile;
    if ( apiKeys.keyFile ) apiKeys.loadKeys();
    return apiKeys.apiKeyCheck;
}

module.exports = apiKeys;
