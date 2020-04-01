const { randomBytes } = require( 'crypto' );
const version = require( '../package.json' ).version;

Object.defineProperty( global.self, 'crypto', {
    value: {
        getRandomValues: arr => randomBytes( arr.length )
    }
} );

Object.defineProperty( window, 'CSS', {
    value: {
        supports: () => {}
    },
    configurable: true
} );

Object.defineProperty( window, 'PRODUCTION', {
    value: true,
    configurable: true
} );

Object.defineProperty( window, 'VERSION', {
    value: version,
    configurable: true
} );
