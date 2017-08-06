'use strict';

const port = 3000;

const apiKeys = require( "./keys.js" );

const express = require( "express" );
const app = express();
const keybug = require( "debug" )("keybug");

app.get( "/:key", apiKeyCheck, function( req, res ) {
    console.log( "Request to /" );
    res.json( { status: "OK", entry: req.body.user } );
})

app.get( "/unauthorized", function( req, res ) {
    console.log( "403" );
    res.status( 403 ).json( {status: "Unauthorized" } );
})
app.listen( port, function() {
    console.log( "Listening on port " + port );
});

function apiKeyCheck( req, res, next ) {
    keybug( req.headers );
    let apiKey = req.params.key;                  // Check params first
    if ( ! apiKey ) apiKey = req.headers.apikey;  // Then look in headers
    keybug( apiKey );
    if ( ! apiKey ) return res.redirect( "/unauthorized" );
    const entry = apiKeys.find( e => { return e.key === apiKey } );
    if ( ! entry || ! entry.user ) return res.redirect( "/unauthorized");
    if ( !req.body ) req.body = {};
    req.body.user = entry;
    next();
}
