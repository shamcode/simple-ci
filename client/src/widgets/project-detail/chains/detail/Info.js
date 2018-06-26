import { options } from 'sham-ui';
import ChainInfoTemplate from './Info.sht';

export default class ChainInfo extends ChainInfoTemplate {
    @options get chain() { return {}; }
    @options get dataSaving() { return false; }
    @options updateProjectChain() {}
}