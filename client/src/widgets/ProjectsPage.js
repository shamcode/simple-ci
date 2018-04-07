import { options, inject } from 'sham-ui';
import ProjectsPageTemplate from './ProjectsPage.sht';

export default class ProjectsPage extends ProjectsPageTemplate {
    @inject store = 'store';

    @options get dataLoaded() { return false;  }
    @options get projects() { return []; }
    @options get errors() { return []; }

    @options
    afterRender() {
        this._loadPageData();
    }

    _loadPageData() {
        this.store.getProjects().then(
            ::this._loadedPageDataSuccess,
            ::this._loadedPageDataFail
        ).finally(
            () => this.update( { dataLoaded: true } )
        )
    }

    _loadedPageDataSuccess( { projects } ) {
        this.update( {
            projects,
            errors: []
        } )
    }

    _loadedPageDataFail() {
        this.update( {
            projects: [],
            errors: [ "Fail loaded project!" ]
        } )
    }
}