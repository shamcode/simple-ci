const crypto = require( 'crypto' );

Object.defineProperty( global.self, 'crypto', {
    value: {
        getRandomValues: arr => crypto.randomBytes( arr.length )
    }
} );

Object.defineProperty( window, 'CSS', {
    value: {
        supports: () => {}
    },
    configurable: true
} );
