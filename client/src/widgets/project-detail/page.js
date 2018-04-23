import { options, inject } from 'sham-ui';
import ProjectDetailPageTemplate from './page.sht';

export default class ProjectDetailPage extends ProjectDetailPageTemplate {
    @inject store = 'store';
    @inject router = 'router';

    @options get dataLoaded() { return false;  }
    @options get project() { return {}; }
    @options get errors() { return []; }

    @options
    afterRender() {
        this._loadPageData();
    }

    get projectId() {
        return this.router.lastRouteResolved().params.id;
    }

    _loadPageData() {
        this.store.getProjectById( this.projectId ).then(
            ::this._loadedPageDataSuccess,
            ::this._loadedPageDataFail
        );
    }

    _loadedPageDataSuccess( { project } ) {
        this.update( {
            project,
            dataLoaded: true,
            errors: []
        } )
    }

    _loadedPageDataFail() {
        this.update( {
            project: {},
            dataLoaded: true,
            errors: [ "Load project fail!" ]
        } )
    }
}