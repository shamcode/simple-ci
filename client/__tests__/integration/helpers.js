import { start, createDI } from 'sham-ui';
import pretty from 'pretty';
import initializer from '../../src/initializers/main';

export const app = {
    async start( waitRendering = true ) {
        const DI = createDI();
        initializer( DI );
        start( DI );
        if ( waitRendering ) {
            await this.waitRendering();
        }
    },
    async waitRendering() {
        await new Promise( resolve => setImmediate( resolve ) );
    },
    click( selector ) {
        document
            .querySelector( selector )
            .click();
    },
    checkBody() {
        expect(
            pretty( document.querySelector( 'body' ).innerHTML, {
                inline: [ 'code', 'pre', 'em', 'strong', 'span' ]
            } ),
        ).toMatchSnapshot();
    },
    project: {
        async open() {
            app.click( '.project-card' );
            await app.waitRendering();
        }
    },
    chain: {
        async open() {
            app.click( '.project-chain' );
            await app.waitRendering();
        }
    },
    modal: {
        async ok() {
            app.click( '.modal .ok' );
            await app.waitRendering();
        }
    },
    form: {
        fill( field, value ) {
            document.querySelector( `[name="${field}"]` ).value = value;
        },
        async submit() {
            app.click( '[type="submit"]' );
            await app.waitRendering();
        }
    }
};

function setupRAF() {
    window.requestAnimationFrame = ( cb ) => {
        setImmediate( cb );
    };
}

function setupLocalStorage(  ) {
    const storage = {};
    window.localStorage = {
        getItem( key ) {
            return storage[ key ] || null;
        },
        setItem( key, value ) {
            storage[ key ] = value;
        },
        removeItem( key ) {
            delete storage[ key ];
        }
    };
}

function clearBody() {
    document.querySelector( 'body' ).innerHTML = '';
}

function setupRouter() {
    delete window.__NAVIGO_WINDOW_LOCATION_MOCK__;
    history.pushState( {}, '', '' );
}

function setupAuth() {
    window.localStorage.setItem( 'token', 'test' );
}

export default function( options = { auth: true } ) {
    setupRAF();
    setupLocalStorage();
    clearBody();
    setupRouter();
    Object.defineProperty( window, 'CSS', { value: () => ( {} ) } );
    if ( options.auth ) {
        setupAuth();
    }
}
