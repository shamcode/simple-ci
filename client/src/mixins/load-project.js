import { configureOptions } from 'sham-ui';
import { inject } from 'sham-ui-macro/babel.macro';

export default ( superclass ) => class LoadProject extends superclass {
    @inject store;
    @inject router;

    configureOptions() {
        super.configureOptions( ...arguments );
        configureOptions( LoadProject.prototype, this, {
            dataLoaded: false,
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

    didMount() {
        super.didMount( ...arguments );
        this._loadPageData();
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
