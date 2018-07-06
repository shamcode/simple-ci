import { DI } from 'sham-ui';
import Session from '../services/session';
import Store from '../services/store';
import Socket from '../services/socket';
import startRouter from './routes';
import disabled from '../directives/disabled';
import EventListenerDirectives from '../directives/event-listener';
import App from '../widgets/App.sht';

export default function() {
    new Store();
    new Session();
    new Socket();

    startRouter();

    const app = new App( 'body', 'app', {
        directives: {
            disabled,
            ...EventListenerDirectives
        }
    } );

    DI.bind( 'widgets:app', app );
};
