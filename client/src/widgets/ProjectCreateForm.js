import { options } from 'sham-ui';
import ProjectCreateFormTemplate from './ProjectCreateForm.sht';

export default class ProjectCreateForm extends ProjectCreateFormTemplate {
    @options get dataSaving() { return false; }
    @options onSubmit() {}

    get formNode() {
        return this.querySelector( 'form' );
    }

    bindEvents() {
        this.__bindedSubmitForm = this._submitForm.bind( this );
        this.formNode.addEventListener(
            'submit',
            this.__bindedSubmitForm
        )
    }

    destroy() {
        this.formNode.removeEventListener(
            'submit',
            this.__bindedSubmitForm
        );
    }

    remove() {
        this.formNode.removeEventListener(
            'submit',
            this.__bindedSubmitForm
        );
        super.remove( ...arguments );
    }

    _submitForm( e ) {
        e.preventDefault();
        const formData = new FormData( this.formNode );
        const data = {};
        formData.forEach( ( value, key ) => data[ key ] = value );
        this.options.onSubmit( data );
    }
}