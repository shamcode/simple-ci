import { options } from 'sham-ui';
import LoadProjectMixin from '../../mixins/load-project';
import ProjectEditPageTemplate from './page.sht';

export default class ProjectEditPage extends LoadProjectMixin( ProjectEditPageTemplate ) {
    @options dataSaving = false;

    updateProject( data ) {
        this.update( {
            dataSaving: true,
            errors: []
        } );
        this.store.updateProject( this.projectId, data ).then(
            ::this._updateProjectSuccess,
            ::this._updateProjectFail
        );
    }

    _updateProjectSuccess() {
        this.router.navigate(
            this.router.generate( 'project-detail', this._routerParams )
        );
    }

    _updateProjectFail() {
        this.update( {
            errors: [ 'Update project fail!' ],
            dataSaving: false
        } );
    }
}
