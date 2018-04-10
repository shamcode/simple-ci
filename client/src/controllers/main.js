import { DI } from 'sham-ui';
import Router from 'sham-ui-router';
import Store from '../services/store';
import disabled from '../directives/disabled';
import EventListenerDirectives from '../directives/event-listener';
import App from '../widgets/App.sht';
import ProjectsPage from '../widgets/ProjectsPage';
import ProjectCreatePage from '../widgets/ProjectCreatePage';

export default function() {
    new Store();

    const router = new Router();
    router
        .bindPage( '/',                'project-list',   ProjectsPage,      {} )
        .bindPage( '/projects/create', 'project-create', ProjectCreatePage, {} );

    const app = new App( 'body', 'app', {
        directives: {
            disabled,
            ...EventListenerDirectives
        }
    } );

    DI.bind( 'widgets:app', app );
};
