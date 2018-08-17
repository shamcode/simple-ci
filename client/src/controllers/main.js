import { DI } from 'sham-ui';
import Session from '../services/session';
import Store from '../services/store';
import Socket from '../services/socket';
import startRouter from './routes';
import directives from 'sham-ui-directives';
import App from '../widgets/App.sht';

export default function() {
    new Store();
    new Session();
    new Socket();

    startRouter();

    const app = new App( 'body', 'app', {
        directives
    } );

    DI.bind( 'widgets:app', app );
}
