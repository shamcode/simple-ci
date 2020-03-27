import { configureOptions } from 'sham-ui';
import { inject } from 'sham-ui-macro/babel.macro';

export default ( superclass ) => class LoadChain extends superclass {
    @inject store;
    @inject router;

    configureOptions() {
        super.configureOptions( ...arguments );
        configureOptions( LoadChain.prototype, this, {
            dataLoaded: false,
            chain: {},
            project: {},
            errors: []
        } );
    }

    get _routerParams() {
        return this.router.storage.params;
    }

    get projectId() {
        return this._routerParams.id;
    }

    get chainId() {
        return this._routerParams.chainId;
    }

    didMount() {
        super.didMount( ...arguments );
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
