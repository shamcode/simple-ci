import { DI } from 'sham-ui'

export default class Session {
    _token = null;

    constructor() {
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
        this._token = headers[ 'Bearer' ];
        this.store.setAuthHeaders( this._token );
        this.router.navigate(
            this.router.generate( 'project-list', {} )
        );
    }

    invalidateSession() {
        this._token = null;
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