import CodeFlask from 'codeflask';
import CodeFlaskTemplate from './CodeFlask.sht';
import { options } from 'sham-ui';

export default class CodeFlaskWidget extends CodeFlaskTemplate {
    @options get name() {
        return '';
    }
    @options get value() {
        return '';
    }

    @options
    afterRender() {
        this.flask = new CodeFlask( this.querySelector( 'div' ), {
            lineNumbers: true
        } );
        this.flask.onUpdate( ( code ) => {
            this.update( {
                value: code
            } );
        } );
    }

    update( data ) {
        super.update( ...arguments );
        if ( this.flask && data ) {
            this.flask.updateCode( data.value );
        }
    }
}
