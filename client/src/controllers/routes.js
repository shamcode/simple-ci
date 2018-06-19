import Router from 'sham-ui-router';
import LoginPage from '../widgets/login/page';
import RegistryPage from '../widgets/registry/page';
import ProjectsPage from '../widgets/project-list/page';
import ProjectCreatePage from '../widgets/project-create/page';
import ProjectDetailPage from '../widgets/project-detail/page';
import ProjectEditPage from '../widgets/project-edit/page';
import ProjectDeletePage from '../widgets/project-delete/page';
import ChainCreatePage from '../widgets/project-detail/chains/create/page';
import ChainDeletePage from '../widgets/project-detail/chains/delete/page';

export default function() {
    const router = new Router( '/' );

    // Auth
    router
        .bindPage( 'login',    'login',    LoginPage,    {} )
        .bindPage( 'registry', 'registry', RegistryPage, {} );

    // Project CRUD
    router
        .bindPage( 'projects/create',     'project-create', ProjectCreatePage, {} )
        .bindPage( 'projects/:id/edit',   'project-edit',   ProjectEditPage,   {} )
        .bindPage( 'projects/:id/delete', 'project-delete', ProjectDeletePage, {} )
        .bindPage( 'projects/:id',        'project-detail', ProjectDetailPage, {} );

    // Project chain CRUD
    const PROJECT = 'projects/:id/chains/';
    router
        .bindPage( `${PROJECT}create`,          'project-chain-create', ChainCreatePage, {} )
        .bindPage( `${PROJECT}:chainId/delete`, 'project-chain-delete', ChainDeletePage, {} );

    // Projects list / root
    router.bindPage( '', 'project-list', ProjectsPage, {} );
}
