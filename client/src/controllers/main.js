import { DI } from 'sham-ui';
import Router from 'sham-ui-router';
import App from '../widgets/App.sht';
import ProjectPage from '../widgets/ProjectsPage';

export default function() {
    const router = new Router();
    router
        .bindPage( '/', 'project-list', ProjectPage, {} );

    const app = new App( 'body', 'app', {

    } );

    DI.bind( 'widgets:app', app );
};
