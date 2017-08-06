'use strict';

const apiKeys = {};
const keybug = require( "debug" )("keybug");

apiKeys.unauthRedirect = undefined;

apiKeys.keyFile = undefined;

apiKeys.keys = undefined;

apiKeys.apiKeyCheck = function ( req, res, next ) {
    keybug( req.headers );
    let apiKey = req.query.apikey;                // Check query first
    if ( ! apiKey ) apiKey = req.headers.apikey;  // Then look in headers
    keybug( "apiKey provided: ", apiKey );
    if ( ! apiKey ) return res.redirect( apiKey.unauthRedirect );
    const entry = apiKeys.keys.find( e => { return e.key === apiKey } );
    if ( ! entry || ! entry.user ) return res.redirect( apiKey.unauthRedirect );
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
