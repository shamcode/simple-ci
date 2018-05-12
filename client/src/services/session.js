import { DI } from 'sham-ui'

export default class Session {
    constructor() {
        const token = localStorage.getItem( 'token' );
        if ( token ) {
            this._token = token;
            this.isAuthenticated = true;
        } else {
            this._token = null;
            this.isAuthenticated = false;
        }
        DI.bind( 'session', this );
    }

    get router() { return DI.resolve( 'router' ); }
    get store() { return DI.resolve( 'store' ); }

    login( username, password ) {
        return this.store.getToken( username, password ).then(
            ::this._loginSuccess
        )
    }

    _loginSuccess( { headers } ) {
        this.isAuthenticated = true;
        this._token = headers[ 'Bearer' ];
        localStorage.setItem( 'token', this._token );
        this.store.setAuthHeaders( this._token );
        this.router.navigate(
            this.router.generate( 'project-list', {} )
        );
    }

    invalidateSession() {
        this.isAuthenticated = false;
        this._token = null;
        localStorage.removeItem( 'token' );
        requestAnimationFrame(
            ::this._goToLoginPage
        );
    }

    _goToLoginPage() {
        this.router.navigate(
            this.router.generate( 'login', {} )
        )
    }

    checkToken( token ) {
        return this._token === token;
    }
}