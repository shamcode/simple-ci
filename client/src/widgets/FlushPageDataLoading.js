import { options } from 'sham-ui';
import FlushPageDataLoadingTemplate from './FlushPageDataLoading.sht';

export default class FlushPageDataLoading extends FlushPageDataLoadingTemplate {
    @options get showLoader() { return false; }
    @options get delay() { return 100; }

    @options
    afterRender() {
        this._timeoutID = setTimeout( ::this._timeoutExpired, this.options.delay );
    }

    _timeoutExpired() {
        this.update( {
            showLoader: true
        } );
    }

    remove() {
        super.remove( ...arguments );
        clearTimeout( this._timeoutID )
    }
}