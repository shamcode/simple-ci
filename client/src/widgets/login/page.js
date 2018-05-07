import { options } from 'sham-ui';
import LoginPageTemplate from './page.sht'

export default class LoginPage extends LoginPageTemplate {
    @options get dataSaving() { return false; }

    get formNode() {
        return this.querySelector( 'form' );
    }

    _submitForm( e ) {
        e.preventDefault();
        const formData = new FormData( this.formNode );
        const data = {};
        let dataValid = true;
        [
            'username',
            'password'
        ].forEach(
            ( key ) => data[ key ] = formData.get( key )
        );
        if ( dataValid ) {
            this.options.onSubmit( data );
        }
    }
}