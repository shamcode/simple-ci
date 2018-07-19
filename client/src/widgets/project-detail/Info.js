import { options, DI } from 'sham-ui';
import InfoTemplate from './Info.sht';

export default class Info extends InfoTemplate {
    @options get project() { return { chains: [] }; }

    get router() {
        return DI.resolve( 'router' );
    }

    _createProjectChainURL( project ) {
        return this.router.generate( 'project-chain-create', {
            id: project.id
        } );
    }

    _routerParams( project ) {
        return {
            id: project === undefined ? null : project.id
        };
    }

    get createChainLinkNode() {
        return this.querySelector( '.project-chain-create' );
    }

    _clickToCreateNewChain( e ) {
        e.preventDefault();
        this.router.navigate( this.createChainLinkNode.getAttribute( 'href' ) );
    }
}