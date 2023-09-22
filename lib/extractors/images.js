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
    'eng',
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    cb( null, text);
  })
}

function testForBinary( options, cb ) {
  cb(true);
  // exec( 'tesseract',
  //   function( error, stdout, stderr ) {
  //     var msg;
  //     // checking for content of help text
  //     if ( ( error && error.toString().indexOf( 'Usage:' ) > -1 ) ||
  //         ( stderr && stderr.toString().indexOf( 'Usage:' ) > -1 ) ||
  //         ( stdout && stdout.toString().indexOf( 'Usage:' ) > -1 ) ) {
  //       cb( true );
  //     } else {
  //       msg = 'INFO: \'tesseract\' does not appear to be installed, ' +
  //        'so textract will be unable to extract images.';
  //       cb( false, msg );
  //     }
  //   }
  // );
}

module.exports = {
  types: ['image/png', 'image/jpeg', 'image/gif'],
  extract: extractText,
  test: testForBinary
};
