import { options, DI } from 'sham-ui';
import ProjectsListTemplate from './ProjectsList.sht';

export default class extends ProjectsListTemplate {
    get router() {
        return DI.resolve( 'router' );
    }

    @options get createProjectURL() {
        return this.router.generate( 'project-create', {} );
    }

    get createProjectLinkNode() {
        return this.querySelector( '.project-card-create' );
    }

    bindEvents() {
        this.__bindedClickToCreateNewProject = this._clickToCreateNewProject.bind( this );
        this.createProjectLinkNode.addEventListener(
            'click',
            this.__bindedClickToCreateNewProject
        )
    }

    destroy() {
        this.createProjectLinkNode.removeEventListener(
            'click',
            this.__bindedClickToCreateNewProject
        );
    }

    remove() {
        this.createProjectLinkNode.removeEventListener(
            'click',
            this.__bindedClickToCreateNewProject
        );
        super.remove( ...arguments );
    }

    _clickToCreateNewProject( e ) {
        e.preventDefault();
        this.router.navigate( this.createProjectLinkNode.getAttribute( 'href' ) );
    }
}