import { options, inject } from 'sham-ui';
import LoginPageTemplate from './page.sht';

export default class LoginPage extends LoginPageTemplate {
    @inject session = 'session';

    @options get errors() {
        return [];
    }
    @options dataSaving = false;
    @options password = '';

    _submitForm( e ) {
        e.preventDefault();
        const formData = new FormData( this.form );
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
            errors: [ 'Login fail' ]
        } );
    }
}
