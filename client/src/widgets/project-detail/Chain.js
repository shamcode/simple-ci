import { options } from 'sham-ui';
import ChainTemplate from './Chain.sht';

export default class Chain extends ChainTemplate {
    @options get chain() { return {}; }
    @options get project() { return {}; }
    @options get isExpand() { return false; }

    _toggleExpand( e ) {
        e.preventDefault();
        this.update( {
            isExpand: !this.options.isExpand
        } )
    }
}