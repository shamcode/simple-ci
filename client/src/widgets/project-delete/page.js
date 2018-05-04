import { options } from 'sham-ui';
import LoadProjectMixin from '../../mixins/load-project';
import ProjectDeletePageTemplate from './page.sht';

export default class ProjecDeletePage extends LoadProjectMixin( ProjectDeletePageTemplate ) {
    @options get dataSaving() { return false; }

    deleteProject() {
        this.update( {
            dataSaving: true,
            errors: []
        } );
        this.store.deleteProject( this.projectId ).then(
            ::this._deleteProjectSuccess,
            ::this._deleteProjectFail
        )
    }

    _deleteProjectSuccess() {
        this.router.navigate(
            this.router.generate( 'project-list', {} )
        );
    }

    _deleteProjectFail() {
        this.router.navigate(
            this.router.generate( 'project-detail', this._routerParams )
        );
    }

    cancelDeleteProject() {
        this.router.navigate(
            this.router.generate( 'project-detail', this._routerParams )
        )
    }
}