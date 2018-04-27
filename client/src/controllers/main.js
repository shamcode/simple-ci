import { DI } from 'sham-ui';
import Router from 'sham-ui-router';
import Store from '../services/store';
import disabled from '../directives/disabled';
import EventListenerDirectives from '../directives/event-listener';
import App from '../widgets/App.sht';
import ProjectsPage from '../widgets/project-list/page';
import ProjectCreatePage from '../widgets/project-create/page';
import ProjectDetailPage from '../widgets/project-detail/page';
import ProjectEditPage from '../widgets/project-edit/page';

export default function() {
    new Store();

    const router = new Router( '/' );
    router
        .bindPage( 'projects/create',   'project-create', ProjectCreatePage, {} )
        .bindPage( 'projects/:id/edit', 'project-edit',   ProjectEditPage, {} )
        .bindPage( 'projects/:id',      'project-detail', ProjectDetailPage, {} )
        .bindPage( '',                  'project-list',   ProjectsPage,      {} );


    const app = new App( 'body', 'app', {
        directives: {
            disabled,
            ...EventListenerDirectives
        }
    } );

    DI.bind( 'widgets:app', app );
};
