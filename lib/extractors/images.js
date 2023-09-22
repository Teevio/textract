var exec = require( 'child_process' ).exec
  , util = require( '../util' )
  , Tesseract = require('tesseract.js');

function tesseractExtractionCommand( options, inputFile, outputFile ) {
  var cmd = 'tesseract ' + inputFile + ' ' + outputFile;
  if ( options.tesseract ) {
    if ( options.tesseract.lang ) {
      cmd += ' -l ' + options.tesseract.lang;
    } else if ( options.tesseract.cmd ) {
      cmd += ' ' + options.tesseract.cmd;
    }
  }
  cmd += ' quiet';
  return cmd;
}

function extractText( filePath, options, cb ) {
  Tesseract.recognize(
    filePath,
    'eng'
  ).then(({ data: { text } }) => {
    cb( null, text);
  })
}

function testForBinary( options, cb ) {
  cb(true);
}

module.exports = {
  types: ['image/png', 'image/jpeg', 'image/gif'],
  extract: extractText,
  test: testForBinary
};
