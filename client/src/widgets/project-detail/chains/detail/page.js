import { options } from 'sham-ui';
import LoadChainMixin from '../../../../mixins/load-chain';
import ChainDetailPageTemplate from './page.sht';

export default class ChainDetailPage extends LoadChainMixin( ChainDetailPageTemplate ) {
    @options dataSaving = false;
    @options get errors() {
        return [];
    }

    @options
    updateProjectChain( formData ) {
        this.update( {
            dataSaving: true,
            errors: []
        } );
        this.store.updateProjectChain( this.options.chain.id, formData ).then(
            ::this._updateProjectChainSuccess,
            ::this._updateProjectChainFail
        );
    }

    _updateProjectChainSuccess() {
        this.update( {
            dataLoaded: false,
            dataSaving: false
        } );
        this._loadPageData();
    }

    _updateProjectChainFail() {
        this.update( {
            errors: [ 'Update project chain fail!' ],
            dataSaving: false
        } );
    }
}
