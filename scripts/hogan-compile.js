var path = require( "path" )
  , fs = require( "fs" )
  , hogan = require("hogan.js")
  , logger
  , compileConfig
  ;

/*
  partials:["html/partials"],
  globals: {},
  contexts: {}
*/

var _registerPartial = function( partialPath ) {
  compileConfig.fullPartialPaths.push( partialPath );
  var partialText = fs.readFileSync( partialPath ).toString();
  var partialName = path.basename( partialPath, ".html" );
  compileConfig.registeredPartials[partialName] = partialText;
};

var _config = function( mimosaConfig ) {
  for ( var context in compileConfig.contexts ) {
    for ( var global in compileConfig.globals ) {
      compileConfig.contexts[context][global] = compileConfig.globals[global];
    }
  }

  compileConfig.registeredPartials = {};
  compileConfig.fullPartialPaths = [];

  var partials = compileConfig.partials;
  for ( var i = 0; i < partials.length; i++ ) {
    var partPath = path.join( mimosaConfig.watch.sourceDir, partials[i] );
    var exists = fs.existsSync( partPath );
    if (exists) {
      var stat = fs.statSync( partPath );
      if (stat.isFile()) {
        _registerPartial( partPath );
      } else {
        fs.readdirSync( partPath )
          .map( function( p ){ return path.join(partPath, p); })
          .forEach( _registerPartial );
      }
    } else {
      // does not exist, errors
    }
  }

};

var _compile = function( mimosaConfig, options, next ) {
  if ( options.files && options.files.length ) {
    for ( var i = 0; i < options.files.length; i++ ) {
      var file = options.files[i];
      // only compile if file is not a partial
      if (compileConfig.fullPartialPaths.indexOf(file.inputFileName) == -1) {
        var template = hogan.compile ( file.inputFileText.toString() );
        var basename = path.basename( file.inputFileName, ".html" );
        file.outputFileText = template.render(
          compileConfig.contexts[basename],
          compileConfig.registeredPartials
        );
      } else {
        // don't want to write the partial
        file.outputFileText = null;
      }
    }
  }
  next();
};

var registration = function( mimosaConfig, register ) {
  logger = mimosaConfig.log;
  _config( mimosaConfig );
  register( ["add","update","buildFile"], "afterCompile", _compile, ["html"] );
};

module.exports = function( compileConf ) {
  compileConfig = compileConf

  return {
    registration: registration
  };
};



