import Router from 'sham-ui-router';
import LoginPage from '../components/login/page.sfc';
import RegistryPage from '../components/registry/page.sfc';
import ProjectsPage from '../components/project-list/page.sfc';
import ProjectCreatePage from '../components/project-create/page.sfc';
import ProjectDetailPage from '../components/project-detail/page.sfc';
import ProjectEditPage from '../components/project-edit/page.sfc';
import ProjectDeletePage from '../components/project-delete/page.sfc';
import ChainCreatePage from '../components/project-detail/chains/create/page.sfc';
import ChainDeletePage from '../components/project-detail/chains/delete/page.sfc';
import ChainDetailPage from '../components/project-detail/chains/detail/page.sfc';
import ChainRunPage from '../components/project-detail/chains/run/page.sfc';

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
        .bindPage( `${PROJECT}:chainId/delete`, 'project-chain-delete', ChainDeletePage, {} )
        .bindPage( `${PROJECT}:chainId/run`,    'project-chain-run',    ChainRunPage, {} )
        .bindPage( `${PROJECT}:chainId`,        'project-chain-detail', ChainDetailPage, {} );

    // Projects list / root
    router.bindPage( '', 'project-list', ProjectsPage, {} );
}
