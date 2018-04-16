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
        [
            'name',
            'cwd'
        ].forEach( ( key ) => data[ key ] = formData.get( key ) );
        this.options.onSubmit( data );
    }
}