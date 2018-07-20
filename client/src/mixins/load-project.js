import { options, inject } from 'sham-ui';

export default ( superclass ) => class extends superclass {
    @inject store = 'store';
    @inject router = 'router';

    @options get dataLoaded() {
        return false;
    }
    @options get project() {
        return {};
    }
    @options get errors() {
        return [];
    }

    @options
    afterRender() {
        this._loadPageData();
    }

    get _routerParams() {
        const lastRoute = this.router.lastRouteResolved();
        return lastRoute !== undefined ? lastRoute.params : null;
    }

    get projectId() {
        const params = this._routerParams;
        return params !== null ? params.id : null;
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
        } );
    }

    _loadedPageDataFail() {
        this.update( {
            project: { chains: [] },
            dataLoaded: true,
            errors: [ 'Load project fail!' ]
        } );
    }
};
