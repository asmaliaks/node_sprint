var React = require('react'), Router = require('./router.js');

// About view
var About = React.createClass({displayName: "About", 
	render: function () {
    	return React.createElement("main", null,	"About");
  	}
});
// Signin view
var Signin = React.createClass({displayName: "Signin",
	render: function () {
    	return React.createElement("main", null,	"Signin");
  	}
});

// Header component
var Header = React.createClass({displayName: "Header",
  render: function () {
	var comp = this;
    return (
		React.createElement("header", null, 
			React.createElement("a", {
					onClick: function () {
						router.navigate('home');
					},
					className: comp.props.currentView == 'home' ? 'active' : ''
				}, "Home"),
			React.createElement("a", {
					onClick: function () {
						router.navigate('about');						
					},					
					className: comp.props.currentView == 'about' ? 'active' : ''	
					
				}, "About"),
			React.createElement("a", {
					onClick: function () {
						router.navigate('signin');
					},
					className: comp.props.currentView == 'signin' ? 'active' : ''

				}, "Signin")
		)
	);
  }
});

// Home view
var Home = React.createClass({displayName: "Home",
  render: function () {
    return React.createElement("main", null,	"Home");
  }
});


// Create router
var router = new Router();

// Application
var App = React.createClass({displayName: "App",
	
	mixins: [router.mixin], 
	
	
	render: function() {
		if (this.state.currentView == 'about') {
        	return React.createElement("div", null, this.about());
		} else if(this.state.currentView == 'home'){
			return React.createElement("div", null, this.home());
		}else if(this.state.currentView == 'signin'){
			return React.createElement("div", null, this.signin());
		}
    },
	
	handleChange: function(value) {
    	this.setState({currentView: value});
    },
	
	getInitialState: function () {	
		var self = this,  initialView = 'home';
		
		// Routes
		router.on('about', function(hash) {
			self.setState({currentView: hash});
		});
		router.on('home', function(hash) {
			self.setState({currentView: hash});
		});
		router.on('signin', function(hash) {
			self.setState({currentView: hash});
		});
		
		// Get initail view
		if (router.path) { // Browser hash has higher priority over server
			initialView = router.path;
		} else 	if (this.props.currentView) { // If defined by on server or starting parameters
			initialView = this.props.currentView;
		}
		
		return { currentView: initialView};
		
    },
	
	home: function () {
		return (
      		React.createElement("div", null, 
        		React.createElement(Header, {onChange: this.handleChange, currentView: this.state.currentView}), 
        		React.createElement(Home)
			)
		);
	}, 
	
	about: function () {
		return (
	      React.createElement("div", null, 
	      	React.createElement(Header, {onChange: this.handleChange, currentView: this.state.currentView}), 
	      	React.createElement(About)
			)
		);
	},
	signin: function () {
		return (
	      React.createElement("div", null,
	      	React.createElement(Header, {onChange: this.handleChange, currentView: this.state.currentView}),
	      	React.createElement(Signin)
			)
		);
	}
});


module.exports = App;