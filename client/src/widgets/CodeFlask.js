import CodeFlask from 'codeflask';
import CodeFlaskTemplate from './CodeFlask.sht';
import { options } from 'sham-ui';

export default class CodeFlaskWidget extends CodeFlaskTemplate {
    @options name = '';
    @options value = '';

    render() {
        super.render( ...arguments );
        this.flask = new CodeFlask( this.flaskContainer, {
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
