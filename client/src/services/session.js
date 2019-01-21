import { DI, inject } from 'sham-ui';

export default class Session {
    @inject router;
    @inject store;

    constructor() {
        if ( !this.isAuthenticated ) {
            this.invalidateSession();
        }
        DI.bind( 'session', this );
    }

    get token() {
        return localStorage.getItem( 'token' );
    }

    get isAuthenticated() {
        return null !== this.token;
    }

    login( username, password ) {
        return this.store.getToken( username, password ).then(
            ::this._loginSuccess
        );
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

    _isNonRestrictedPage() {
        const page = this.router.lastRouteResolved();
        return undefined !== page && [
            'registry',
            'login'
        ].includes( page.name );
    }

    _goToLoginPage() {
        if ( !this._isNonRestrictedPage() ) {
            this.router.navigate(
                this.router.generate( 'login', {} )
            );
        }
    }
}
