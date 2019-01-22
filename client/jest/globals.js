const { randomBytes } = require( 'crypto' );

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
