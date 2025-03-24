// Load dependencies.
const babelMinify = require( 'babel-minify' );
const babel = require( '@babel/standalone' );
const acorn = require( 'acorn' );
const escodegen = require( 'escodegen' );

babel.transformSync = babel.transform;

// URI-encode only a subset of characters. Most user agents are permissive with
// non-reserved characters, so don't obfuscate more than we have to.
const specialCharacters = [ '%', '"', '<', '>', '#', '@', ' ', '\\&', '\\?' ];

// CDN URL for jQuery.
const jQueryURL = 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js';

// Default minimum jQuery version.
const jQueryMinVersion = 1.7;

const jquery = code => `void function ($) {
  var loadBookmarklet = function ($) {${code}};
  if($ && $.fn && parseFloat($.fn.jquery) >= ${jQueryMinVersion}) {
    load($);
    return;
  }

  var s = document.createElement('script');
  s.src = '${jQueryURL}';
  s.onload = s.onreadystatechange = function () {
    var state = this.readyState;
    if(!state || state === 'loaded' || state === 'complete') {
      loadBookmarklet(jQuery.noConflict());
    }
  };

  document.getElementsByTagName('head')[0].appendChild(s);
}(window.jQuery);`;

const iife = code => `void function () {${code}\n}();`;
const minify = ( code, mangle ) => babelMinify( code, { mangle, deadcode: false, evaluate: false }, { babel, comments: false } ).code;
const prefix = code => `javascript:${code}`;
const transpile = code => babel.transform( code, { comments: false, filename: 'bookmarklet.js', presets: [ 'env' ], targets: '> 2%, not dead' } ).code;
const urlencode = ( code, preserveSiteSearch ) => code.replace( new RegExp( specialCharacters.join( '|' ), 'g' ), (match, offset, string) => {
  // Skip encoding '%s' if preserveSiteSearch is true, otherwise encode normally
  if (preserveSiteSearch && match === '%' && string[offset + 1] === 's') {
    return '%';
  }
  return encodeURIComponent(match);
});

// Create a bookmarklet.
module.exports = ( code, options = {} ) => {
  let result = code;

  // Add jQuery? (also adds IIFE wrapper).
  if ( options.jQuery || options.jquery ) {
    options.jQuery = true;
    result = jquery( result );
  }

  // Add IIFE wrapper?
  if ( ( options.iife || options.anonymize ) && !options.jQuery ) {
    result = iife( result );
  }

  // Transpile?
  if ( options.transpile ) {
    result = transpile( result );
  }

  // Minify by default
  result = minify( result, options.mangleVars || false );

  // If code minifies down to nothing, stop processing.
  if ( '' === result.replace( /^"use strict";/, '').replace( /^void function\(\){}\(\);$/, '' ) ) {
    return null;
  }

  // Replace double quotes with single?
  if (options.useSingleQuotes) {

    const ast = acorn.parse(result, { ecmaVersion: 2020 });

    result = escodegen.generate(ast, {
      format: {
        indent: {
          style: '',
        },
        newline: '',
        space: '',
        quotes: 'single',
        semicolons: false,
        safeConcatenation: true,
        preserveBlankLines: false
      }
    });
    console.log(result);

    // strip leading newline that for some reason gets generated
    result = result.trim()
  }

  // URL-encode by default.
  if ( options.urlencode || 'undefined' === typeof options.urlencode ) {
    result = urlencode(result, options.preserveSiteSearch || false);
  }

  // Add javascript prefix.
  return prefix( result );
};
