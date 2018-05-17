import { DI } from 'sham-ui'

export default class Session {
    constructor() {
        if ( !this.isAuthenticated ) {
            this.invalidateSession();
        }
        DI.bind( 'session', this );
    }

    get router() { return DI.resolve( 'router' ); }
    get store() { return DI.resolve( 'store' ); }

    get token() {
        return localStorage.getItem( 'token' )
    }

    get isAuthenticated() {
        return null !== this.token
    }

    login( username, password ) {
        return this.store.getToken( username, password ).then(
            ::this._loginSuccess
        )
    }

    _loginSuccess( { data } ) {
        localStorage.setItem( 'token', data.token );
        this.router.navigate(
            this.router.generate( 'project-list', {} )
        );
    }

    invalidateSession() {
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
}