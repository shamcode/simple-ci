import { options } from 'sham-ui';
import ProjectsPageTemplate from './ProjectsPage.sht';

export default class ProjectsPage extends ProjectsPageTemplate {
    @options get dataLoaded() { return false;  }
    @options get projects() { return []; }
    @options get errors() { return []; }

    @options
    afterRender() {
        this._loadPageData();
    }

    _loadPageData() {
        const loading = new Promise( ( resolve ) => {
            setTimeout( () => resolve( {
                projects: [
                    { name: 'Fixture' },
                    { name: 'Second fixture' },
                    { name: 'Simple CI' },
                    { name: 'Simple CI 1' },
                    { name: 'Simple CI 2' },
                    { name: 'Snackbars are often used as tooltips/popups' }
                ]
            } ), 500 );
        } );
        loading.then(
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