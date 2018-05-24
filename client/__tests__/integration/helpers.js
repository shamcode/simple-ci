export function setupRAF() {
    window.requestAnimationFrame = ( cb ) => {
        setImmediate( cb )
    };
}

export function setupLocalStorage(  ) {
    const storage = {};
    window.localStorage = {
        getItem( key ) { return storage[ key ] || null; },
        setItem( key, value ) { storage[ key ] = value; },
        removeItem( key ) { delete storage[ key ]; }
    };
}

export function clearBody() {
    document.querySelector( 'body' ).innerHTML = '';
}

export function setupRouter() {
    window.location.hash = '';
    delete window.__NAVIGO_WINDOW_LOCATION_MOCK__;
    history.pushState( {}, '', '' );
}

export function flushPromises() {
    return new Promise( resolve => setImmediate( resolve ) );
}

export default function() {
    setupRAF();
    setupLocalStorage();
    clearBody();
    setupRouter();
}