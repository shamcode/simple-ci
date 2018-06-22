import { options } from 'sham-ui';
import LoadChainMixin from '../../../../mixins/load-chain';
import ChainDetailPageTemplate from './page.sht';

export default class ChainDetailPage extends LoadChainMixin( ChainDetailPageTemplate ) {
    @options get dataSaving() { return false; }
}