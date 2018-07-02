import { options } from 'sham-ui';
import BreadCrumbTemplate from './BreadCrumb.sht';

export default class BreadCrumb extends BreadCrumbTemplate {
    @options get project() { return null }
    @options get chain() { return null }
    @options get currentPage() { return ''; }

    routerParamsForProject( project ) {
        return {
            id: project === undefined ? null : project.id
        }
    }

    routerParamsForChain( project, chain ) {
        return {
            id: project === undefined ? null : project.id,
            chainId: chain === undefined ? null : chain.id
        }
    }

    dataReady( project, chain ) {
        return ( project === null || project.id ) && ( chain === null || chain.id )
    }
}