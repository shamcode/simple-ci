import { options, inject } from 'sham-ui';
import LoadChainMixin from '../../../../mixins/load-chain';
import ChainRunPageTemplate from './page.sht';

export default class ChainRunPage extends LoadChainMixin( ChainRunPageTemplate ) {
    /** @type Socket */
    @inject socket = 'socket';

    @options get dataSaving() { return false; }
    @options get errors() { return []; }
    @options get commandOutput() { return ''; }

    runProjectChain() {
        this.update( {
            dataSaving: true,
            errors: []
        } );
        this.socket.connect().then(
            ::this._runProjectChain
        );
    }

    _runProjectChain() {
        const chainId = this.options.chain.id;
        this.socket.watch( chainId, this.updateCommandOutput );
        this.store.runProjectChain( chainId ).then(
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

    updateCommandOutput = ( commandOutput ) => {
        if ( undefined === this ) {
            return;
        }
        this.update( {
            commandOutput
        } );
    };

    remove() {
        this.socket.removeWatcher( this.updateCommandOutput );
        super.remove()
    }
}