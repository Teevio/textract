var fs = require( 'fs' )
  , iconv = require( 'iconv-lite' )
  , jschardet = require( 'jschardet' )
  , path = require( 'path' )
  ;

function extractText( filePath, options, cb ) {
  fs.readFile( filePath, function( error, data ) {
    var encoding, encodingOriginal, decoded, detectedEncoding;
    if ( error ) {
      cb( error, null );
      return;
    }
    try {
      detectedEncoding = jschardet.detect( data ).encoding;
      if ( !detectedEncoding ) {
        error = new Error( 'Could not detect encoding for file named [[ ' +
          path.basename( filePath ) + ' ]]' );
        cb( error, null );
        return;
      }

      // windows-1252 seems to be a fallback that is wrong and this kills all emojis
      // so if it's windows-1252 let's try utf-8 first and if that fails, default
      // back to windows-1252
      encodingOriginal = detectedEncoding.toLowerCase();
      encoding = encodingOriginal == 'windows-1252' ? 'utf-8' : encodingOriginal;

      try {
        decoded = iconv.decode( data, encoding );
      } catch ( e ) {
        decoded = iconv.decode( data, encodingOriginal );
      }

    } catch ( e ) {
      cb( e );
      return;
    }
    cb( null, decoded );
  });
}

module.exports = {
  types: [/text\//, 'application/csv', 'application/javascript'],
  extract: extractText
};
