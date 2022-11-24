import { $ } from 'sham-ui-macro/ref.macro';
import { createRootContext } from 'sham-ui';
import Session from '../services/session';
import Store from '../services/store';
import Socket from '../services/socket';
import startRouter from './routes';
import * as directives from 'sham-ui-directives';
import hrefto from 'sham-ui-router/lib/href-to';
import App from '../components/App.sht';

export default function( DI ) {
    new Store( DI );
    new Session( DI );
    new Socket( DI );

    startRouter( DI );

    new App(
        createRootContext( {
            DI,
            ID: 'app',
            container: document.querySelector( 'body' ),
            directives: {
                ...directives,
                hrefto
            }
        } ),
        {
            [ $.version ]: VERSION
        }
    );
}
