import { options } from 'sham-ui';
import ChainFormTemplate from './ChainForm.sht';

function extractValue( value ) {
    return value.trim();
}

function validateValue( value ) {
    return value.length > 0;
}

export default class ProjectForm extends ChainFormTemplate {
    @options get name() { return ''; }
    @options get saveButtonText() { return ''; }
    @options get dataSaving() { return false; }
    @options onSubmit() {}

    get formNode() {
        return this.querySelector( 'form' );
    }

    _submitForm( e ) {
        e.preventDefault();
        const formData = new FormData( this.formNode );
        const data = {};
        let dataValid = true;
        [
            'name',
        ].forEach( ( key ) => {
            const value = extractValue( formData.get( key ) );
            dataValid = dataValid && validateValue( value );
            if ( dataValid ) {
                data[ key ] = value;
            }
        } );
        if ( dataValid ) {
            this.options.onSubmit( data );
        }
    }
}