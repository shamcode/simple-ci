import { options } from 'sham-ui';
import ProjectCreateFormTemplate from './ProjectCreateForm.sht';

export default class ProjectCreateForm extends ProjectCreateFormTemplate {
    @options get dataSaving() { return false; }
    @options onSubmit() {}

    get formNode() {
        return this.querySelector( 'form' );
    }

    _submitForm( e ) {
        e.preventDefault();
        const formData = new FormData( this.formNode );
        const data = {};
        formData.forEach( ( value, key ) => data[ key ] = value );
        this.options.onSubmit( data );
    }
}