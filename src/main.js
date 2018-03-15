"use strict";

var React = require('react');
var Router = require('react-router');
var routes = require('./routes');
    
//Function to render Route depending on the hash change
Router.run(routes, function (Handler) { 
    React.render(<Handler/>, document.getElementById('app'));
});


