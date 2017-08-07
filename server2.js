'use strict';

const port = 3000;

const apiKeys = require( "./keys.js" );

const express = require( "express" );
const app = express();
const keybug = require( "debug" )("keybug");
const apiKeyCheck = require( "./apiKeys.js" ).config( { unauthRedirect: "/unauthorized", keyFile: "./keys.js" } );

app.get( "/", apiKeyCheck, function( req, res ) {
    console.log( "Request to /" );
    console.log( "Parameters: ", req.params );
    console.log( "Query     : ", req.query );
    res.json( { status: "OK", entry: req.body.user } );
})

app.get( "/unauthorized", function( req, res ) {
    console.log( "403" );
    res.status( 403 ).json( {status: "Unauthorized" } );
})

app.listen( port, function() {
    console.log( "Listening on port " + port );
});
