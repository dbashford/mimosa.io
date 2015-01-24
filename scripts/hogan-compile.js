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

var _registerPartial = function( hS, partialPath ) {
  hS.fullPartialPaths.push( partialPath );
  var partialText = fs.readFileSync( partialPath ).toString();
  var partialName = path.basename( partialPath, ".html" );
  hS.registeredPartials[partialName] = partialText;
};

var validate = function( mimosaConfig, validators ) {
  mimosaConfig.hoganStatic = compileConfig;

  var hS = mimosaConfig.hoganStatic
  for ( var context in hS.contexts ) {
    for ( var global in hS.globals ) {
      if ( hS.contexts[context][global] === undefined ) {
        hS.contexts[context][global] = hS.globals[global];
      }
      hS.contexts[context].pageName = context;
    }
  }

  hS.registeredPartials = {};
  hS.fullPartialPaths = [];

  var partials = hS.partials;
  for ( var i = 0; i < partials.length; i++ ) {
    var partPath = path.join( mimosaConfig.watch.sourceDir, partials[i] );
    var exists = fs.existsSync( partPath );
    if (exists) {
      var stat = fs.statSync( partPath );
      if (stat.isFile()) {
        _registerPartial( hS, partPath );
      } else {
        fs.readdirSync( partPath )
          .map( function( p ){ return path.join(partPath, p); })
          .forEach( function( p ){ _registerPartial( hS, p); } );
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
      if (mimosaConfig.hoganStatic.fullPartialPaths.indexOf(file.inputFileName) == -1) {
        var template = hogan.compile ( file.inputFileText.toString() );
        var basename = path.basename( file.inputFileName, ".html" );
        var context = mimosaConfig.hoganStatic.contexts[basename];
        if (context.pageName && context.pageName === basename ) {
          context[basename] = true;
        }
        file.outputFileText = template.render(
          context,
          mimosaConfig.hoganStatic.registeredPartials
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
  validate( mimosaConfig )
  register( ["add","update","buildFile"], "afterCompile", _compile, ["html"] );
};

module.exports = function( compileConf ) {
  compileConfig = compileConf;

  return {
    registration: registration
  };
};