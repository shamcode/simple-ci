import { options } from 'sham-ui';
import LoadChainMixin from '../../../../mixins/load-chain';
import ChainDeletePageTemplate from './page.sht';

export default class ChainDeletePage extends LoadChainMixin( ChainDeletePageTemplate ) {
    @options dataSaving = false;

    @options bodyText( chain ) {
        return `Do you want delete chain "${chain.name}"?`;
    }

    get projectDetailURL() {
        return this.router.generate( 'project-detail', { id: this.projectId } );
    }

    @options
    deleteChain() {
        this.update( {
            dataSaving: true,
            errors: []
        } );
        this.store.deleteChain( this.chainId ).then(
            ::this._deleteChainSuccess,
            ::this._deleteChainFail
        );
    }

    _deleteChainSuccess() {
        this.router.navigate( this.projectDetailURL );
    }

    _deleteChainFail() {
        this.router.navigate( this.projectDetailURL );
    }

    @options
    cancelDeleteChain() {
        this.router.navigate( this.projectDetailURL );
    }
}
