import { options, inject } from 'sham-ui';
import ProjectCreatePageTemplate from './page.sht';

export default class ProjectCreatePage extends ProjectCreatePageTemplate {
    @inject store = 'store';
    @inject router = 'router';

    @options get errors() {
        return [];
    }
    @options dataSaving = false;

    @options
    createProject( data ) {
        this.update( {
            dataSaving: true,
            errors: []
        } );
        this.store.createProject( data ).then(
            ::this._createProjectSuccess,
            ::this._createProjectFail
        );
    }

    _createProjectSuccess() {
        this.router.navigate(
            this.router.generate( 'project-list', {} )
        );
    }

    _createProjectFail() {
        this.update( {
            errors: [ 'Create project fail!' ],
            dataSaving: false
        } );
    }
}
