var URL = require('url');
require('querystring');
var Router = function () {
	var self = this;	
	
	// Detect environment
	this.isBrowser = typeof window !== 'undefined' &&  window.document && window.document.createElement;
	this.hasHistory = this.isBrowser && window.history && 'pushState' in window.history;
	
	// Init variables
	this.listeners = {};
	this.path = this.getPath();
	
	// Add listeners
	if (this.isBrowser && !this.hasHistory) {
		window.addEventListener('hashchange', function () {
			console.log('hashchange', event);
			self.onPathChange();
		});		
		
	} else if (this.hasHistory) {
		window.addEventListener('popstate', function(event) {
			console.log('popstate', event);
		    if (event.state) {
		        var path = event.state.path; 					
				self.onPathChange(path);			
		    }
		}, false);		
		window.history.pushState({path: this.path}, '', '?path=' + this.path);
	}	
};



Router.prototype.on = function (key, fn) {
	this.listeners[key] = fn;
};

Router.prototype.getPath = function () {
	var path, hash, url;

	if (this.isBrowser && this.hasHistory) {
		url = window.location.toString();
		return this.getPathFromUrl(url);
	} 
	
	if (this.isBrowser) {
		hash = window.location.hash;
		if (hash && hash.substring(0, 1) == '#') {
			hash = hash.substring(1);
		}	
		return hash;
	}		
	return '';
};

Router.prototype.onPathChange = function (newPath) {
	newPath = newPath || this.getPath();
	console.log('path change', newPath);
		
	// Call listener
	if (typeof this.listeners[newPath] == 'function') {
		this.listeners[newPath](newPath);
	}
};

Router.prototype.navigate = function (newPath) {
	if (this.isBrowser && !this.hasHistory) {
		window.location.hash = '#' + newPath;
	} else if (this.hasHistory) {
		this.path = newPath;
		window.history.pushState({path: newPath}, '', '?path=' + newPath);
		this.onPathChange(newPath);		
	}
};

Router.prototype.getPathFromUrl = function (url) {
	var urlParts = URL.parse(url, true);
	var query = urlParts.query;
	if (query) {
		return query.path || '';
	} else {
		return '';
	}	
};

Router.prototype.serverRoute = function (req) {
	return this.getPathFromUrl(req.url);
};

module.exports = Router;