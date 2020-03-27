import { DI } from 'sham-ui';
import { inject } from 'sham-ui-macro/babel.macro';

export default class Socket {
    @inject session;

    constructor() {
        DI.bind( 'socket', this );
        this.connection = null;
        this.connectionPromise = null;
        this.handlers = [];
    }

    connect() {
        if ( null !== this.connectionPromise ) {
            return this.connectionPromise;
        }
        this.connectionPromise = new Promise( resolve => {
            this.connection = new WebSocket(
                PRODUCTION ?
                    `ws://${document.location.host}/ws/${this.session.token}` :
                    `ws://localhost:3001/ws/${this.session.token}`
            );
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

    _onerror() {}

    _onclose() {
        this.connectionPromise = null;
        this.connection = null;
        this.handlers = [];
    }

    _onmessage( event ) {
        this.handlers.forEach( handler => handler( event.data ) );
    }

    watch( chainId, callback ) {
        this.handlers.push( callback );
        this.connection.send(
            JSON.stringify( {
                chainId
            } )
        );
    }

    removeWatcher( callback ) {
        const index = this.handlers.indexOf( callback );
        if ( -1 !== index ) {
            this.handlers.splice( index, 1 );
        }
    }
}
