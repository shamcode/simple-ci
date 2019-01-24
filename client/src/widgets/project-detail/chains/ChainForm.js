import { options } from 'sham-ui';
import ChainFormTemplate from './ChainForm.sht';

function extractValue( value ) {
    return value.trim();
}

function validateValue( value ) {
    return value.length > 0;
}

export default class ProjectForm extends ChainFormTemplate {
    @options name = '';
    @options command = '';
    @options saveButtonText = '';
    @options dataSaving = false;
    @options onSubmit() {}

    _submitForm( e ) {
        e.preventDefault();
        const formData = new FormData( this.formNode );
        const data = {};
        let dataValid = true;
        [
            'name'
        ].forEach( ( key ) => {
            const value = extractValue( formData.get( key ) );
            dataValid = dataValid && validateValue( value );
            if ( dataValid ) {
                data[ key ] = value;
            }
        } );
        if ( dataValid ) {
            data.command = extractValue( formData.get( 'command' ) );
            this.options.onSubmit( data );
        }
    }
}
