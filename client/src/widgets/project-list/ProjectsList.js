import { options, DI } from 'sham-ui';
import ProjectsListTemplate from './ProjectsList.sht';

export default class extends ProjectsListTemplate {
    get router() {
        return DI.resolve( 'router' );
    }

    @options get createProjectURL() {
        return this.router.generate( 'project-create', {} );
    }

    detailPageUrlForProject( id ) {
        return this.router.generate( 'project-detail', { id } );
    }

    get createProjectLinkNode() {
        return this.querySelector( '.project-card-create' );
    }

    _clickToDetailProject( e ) {
        e.preventDefault();
        this.router.navigate( e.currentTarget.getAttribute( 'href' ) );
    }

    _clickToCreateNewProject( e ) {
        e.preventDefault();
        this.router.navigate( this.createProjectLinkNode.getAttribute( 'href' ) );
    }
}