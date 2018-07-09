import { DI } from 'sham-ui'

export default class Socket {
    constructor() {
        DI.bind( 'socket', this );
        this.connection = null;
        this.connectionPromise = null;
    }

    connect() {
        if ( null !== this.connectionPromise ) {
            return this.connectionPromise;
        }
        this.connectionPromise = new Promise( resolve => {
            this.connection = new WebSocket( `ws://${document.location.host}/ws`  );
            this._bindHandlers();
            this.connection.onopen = resolve;
        } );
        return this.connectionPromise;
    }

    _bindHandlers() {
        [
            'error',
            'close',
            'message'
        ].forEach( type => {
            this.connection[ `on${type}` ] = ::this[ `_on${type}` ];
        } );
    }

    _onerror( event ) {
        console.error( event );
    }

    _onclose() {
        this.connectionPromise = null;
        this.connection = null;
    }

    _onmessage( event ) {
        console.dir( event );
    }

    watch( chainId ) {
        this.connection.send(
            JSON.stringify( {
                chainId
            } )
        )
    }
}