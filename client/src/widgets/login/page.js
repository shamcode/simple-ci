import { options, inject } from 'sham-ui';
import LoginPageTemplate from './page.sht'

export default class LoginPage extends LoginPageTemplate {
    @inject session = 'session';
    @inject router = 'router';

    @options get errors() { return []; }
    @options get dataSaving() { return false; }
    @options get password() { return ''; }

    get formNode() {
        return this.container.querySelector( 'form' );
    }

    _submitForm( e ) {
        e.preventDefault();
        const formData = new FormData( this.formNode );
        this.update( {
            dataSaving: true,
            errors: []
        } );
        this.session.login(
            formData.get( 'username' ).trim(),
            formData.get( 'password' )
        ).catch(
            ::this.loginFail
        );
    }

    loginFail() {
        this.update( {
            password: '',
            dataSaving: false,
            errors: [ 'Login fail' ],
        } )
    }
}