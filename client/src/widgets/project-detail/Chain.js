import { options } from 'sham-ui';
import ChainTemplate from './Chain.sht';

export default class Chain extends ChainTemplate {
    @options get chain() {
        return {};
    }
    @options isExpand = false;
    @options get project() {
        return { chains: [] };
    }

    _routerParams( project, chain ) {
        return {
            id: project === undefined ? null : project.id,
            chainId: chain === undefined ? null : chain.id
        };
    }

    _toggleExpand( e ) {
        e.preventDefault();
        this.update( {
            isExpand: !this.options.isExpand
        } );
    }
}
