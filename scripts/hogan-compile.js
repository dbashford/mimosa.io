var path = require( "path" )
  , hogan = require("hogan.js")
  , logger
  , compileConfig
  ;

/*
  partials:["html/partials"],
  globals: {},
  contexts: {}
*/

var _config = function( compileConf ) {
  compileConfig = compileConf;

  for ( var context in compileConfig.contexts ) {
    for (var global in compileConf.globals) {
      compileConfig.contexts[context][global] = compileConf.globals[global];
    }
  }
};

var _compile = function( mimosaConfig, options, next ) {
  if ( options.files && options.files.length ) {
    for ( var i = 0; i < options.files.length; i++ ) {
      var file = options.files[i];
      var template = hogan.compile ( file.inputFileText.toString() );
      var basename = path.basename( file.inputFileName, ".html" );
      file.outputFileText = template.render( compileConfig.contexts[basename] );
    }
  }
  next();
};

var registration = function( mimosaConfig, register ) {
  logger = mimosaConfig.log;
  register( ["add","update","buildFile"], "compile", _compile, ["html"] );
};

module.exports = function( compileConf ) {
  _config( compileConf );

  return {
    registration: registration
  };
};



