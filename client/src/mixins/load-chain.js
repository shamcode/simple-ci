import { options, inject } from 'sham-ui'

export default ( superclass ) => class extends superclass {
    @inject store = 'store';
    @inject router = 'router';

    @options get dataLoaded() { return false;  }
    @options get chain() { return {}; }
    @options get errors() { return []; }

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

    get chainId() {
        const params = this._routerParams;
        return params !== null ? params.chainId : null;
    }

    _loadPageData() {
        this.store.getProjectChainById( this.chainId ).then(
            ::this._loadedPageDataSuccess,
            ::this._loadedPageDataFail
        );
    }

    _loadedPageDataSuccess( { chain } ) {
        this.update( {
            chain,
            dataLoaded: true,
            errors: []
        } )
    }

    _loadedPageDataFail() {
        this.update( {
            chain: {},
            dataLoaded: true,
            errors: [ "Load project chain fail!" ]
        } )
    }
}