import Session from '../services/session';
import Store from '../services/store';
import Socket from '../services/socket';
import startRouter from './routes';
import * as directives from 'sham-ui-directives';
import App from '../widgets/App.sht';

export default function() {
    new Store();
    new Session();
    new Socket();

    startRouter();

    new App( {
        ID: 'app',
        containerSelector: 'body',
        directives
    } );
}
