import { inject, options } from 'sham-ui';
import RegistryPageTemplate from './page.sht'

export default class RegistryPage extends RegistryPageTemplate {
    @inject store = 'store';

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
        this.store.registry(
            formData.get( 'username' ).trim(),
            formData.get( 'password' )
        ).catch(
            ::this.createFail
        );
    }

    createFail() {
        this.update( {
            password: '',
            dataSaving: false,
            errors: [ 'Login fail' ],
        } )
    }
}