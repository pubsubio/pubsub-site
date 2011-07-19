var fs = require('fs');
var ejs = require('ejs');
var exec = require('child_process').exec;
var common = require('common');

exports.add = function(name, fn) {
	fns[name] = fn;
	return exports;
};

var fns = {
	// todo: add circular check
	file : function(filename, callback) {
		common.step([
			function(next) {
				fs.readFile(filename, 'utf-8', next);
			},
			function(src) {
				render(src, callback);
			}
		], callback);
	}
};

exports.renderFile = function(file, options, callback) {
	common.step([
		function(next) {
			fs.readFile(file, 'utf-8', next);
		},
		function(template) {
			render(template, options, callback);
		}
	], callback);
};

var render = function(src, options, callback) {
	if (!callback) {
		callback = options;
		options = {};
	}
	options = options || {};
	options.locals = options.locals || {};
	
	common.step([
		function(next) {
			var args = [];
						
			Object.keys(fns).forEach(function(name) {
				options.locals[name] = function() {
					args.push([name].concat(Array.prototype.slice.call(arguments)));
				};
			});

			var result = ejs.render(src, options);
			
			if (!args.length) {
				callback(null, result);
				return;
			}
			
			args.forEach(function(arg) {
				var name = arg.shift();
				
				arg.push(next.parallel());
				fns[name].apply(fns, arg);
			});
		},
		function(results, next) {
			var i = 0;
			
			Object.keys(fns).forEach(function(name) {
				options.locals[name] = function() {
					return results[i++];
				}
			});
			
			src = ejs.render(src, options);
		
			callback(null,src);
		}
	]);
};

exports.render = render;
exports.fn = fns;