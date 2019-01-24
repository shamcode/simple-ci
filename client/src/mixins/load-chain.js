import { options, inject } from 'sham-ui';

export default ( superclass ) => class extends superclass {
    @inject store;
    @inject router;

    @options dataLoaded = false;
    @options get chain() {
        return {};
    }
    @options get project() {
        return {};
    }
    @options get errors() {
        return [];
    }

    get _routerParams() {
        const lastRoute = this.router.lastRouteResolved();
        return lastRoute !== undefined ? lastRoute.params : null;
    }

    get projectId() {
        const params = this._routerParams;
        return params !== null ? params.id : null;
    }

    get chainId() {
        const params = this._routerParams;
        return params !== null ? params.chainId : null;
    }

    render() {
        super.render( ...arguments );
        this._loadPageData();
    }

    _loadPageData() {
        Promise.all( [
            this.store.getProjectById( this.projectId ),
            this.store.getProjectChainById( this.chainId )
        ] ).then(
            ::this._loadedPageDataSuccess,
            ::this._loadedPageDataFail
        );
    }

    _loadedPageDataSuccess( [ { project }, { chain } ] ) {
        this.update( {
            project,
            chain,
            dataLoaded: true,
            errors: []
        } );
    }

    _loadedPageDataFail() {
        this.update( {
            chain: {},
            dataLoaded: true,
            errors: [ 'Load project chain fail!' ]
        } );
    }
};
