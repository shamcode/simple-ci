import { options, inject } from 'sham-ui';
import ProjectsPageTemplate from './page.sht';

export default class ProjectsPage extends ProjectsPageTemplate {
    @inject store = 'store';

    @options get dataLoaded() {
        return false;
    }
    @options get projects() {
        return [];
    }
    @options get errors() {
        return [];
    }

    render() {
        super.render( ...arguments );
        this._loadPageData();
    }

    _loadPageData() {
        this.store.getProjects().then(
            ::this._loadedPageDataSuccess,
            ::this._loadedPageDataFail
        );
    }

    _loadedPageDataSuccess( { projects } ) {
        this.update( {
            projects,
            dataLoaded: true,
            errors: []
        } );
    }

    _loadedPageDataFail() {
        this.update( {
            projects: [],
            dataLoaded: true,
            errors: [ 'Fail loaded project!' ]
        } );
    }
}
