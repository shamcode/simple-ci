import { $ } from 'sham-ui-macro/ref.macro';

export default function LoadChain( options, update, didMount ) {
    const dataLoaded = $();
    const chain = $();
    const project = $();
    const errors = $();

    options( {
        [ dataLoaded ]: false,
        [ chain ]: {},
        [ project ]: {},
        [ errors ]: []
    } );

    const store = this.DI.resolve( 'store' );
    const router = this.DI.resolve( 'router' );

    const _loadPageData = $();
    this[ _loadPageData ] = () => Promise.all( [
        store.getProjectById( router.storage.params.id ),
        store.getProjectChainById( router.storage.params.chainId )
    ] ).then(
        ( [ pageData, chainData ] ) => update( {
            [ project ]: pageData.project,
            [ chain ]: chainData.chain,
            [ dataLoaded ]: true,
            [ errors ]: []
        } ),
        () => update( {
            [ chain ]: {},
            [ dataLoaded ]: true,
            [ errors ]: [ 'Load project chain fail!' ]
        } )
    );

    didMount( () => this[ _loadPageData ]() );
}
