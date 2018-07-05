import { options } from 'sham-ui';
import LoadChainMixin from '../../../../mixins/load-chain';
import ChainRunPageTemplate from './page.sht';

export default class ChainRunPage extends LoadChainMixin( ChainRunPageTemplate ) {
    @options get dataSaving() { return false; }
    @options get errors() { return []; }

    runProjectChain() {
        this.update( {
            dataSaving: true,
            errors: []
        } );
        this.store.runProjectChain( this.options.chain.id ).then(
            ::this._runProjectChainSuccess,
            ::this._runProjectChainFail
        )
    }

    _runProjectChainSuccess() {
        this.update( {
            dataLoaded: false,
            dataSaving: false
        } );
        this._loadPageData()
    }

    _runProjectChainFail() {
        this.update( {
            errors: [ 'Run project chain fail!' ],
            dataSaving: false
        } );
    }
}