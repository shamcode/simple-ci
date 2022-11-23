import { $, this$ } from 'sham-ui-macro/ref.macro';

export default function LoadChain( options, didMount ) {
    const dataLoaded = $();
    const chain = $();
    const project = $();
    const errors = $();

    const state = options( {
        [ dataLoaded ]: false,
        [ chain ]: {},
        [ project ]: {},
        [ errors ]: []
    } );

    const store = this.ctx.DI.resolve( 'store' );
    const router = this.ctx.DI.resolve( 'router' );

    this$._loadPageData = () => Promise.all( [
        store.getProjectById( router.storage.params.id ),
        store.getProjectChainById( router.storage.params.chainId )
    ] ).then(
        ( [ pageData, chainData ] ) => state( {
            [ project ]: pageData.project,
            [ chain ]: chainData.chain,
            [ dataLoaded ]: true,
            [ errors ]: []
        } ),
        () => state( {
            [ chain ]: {},
            [ dataLoaded ]: true,
            [ errors ]: [ 'Load project chain fail!' ]
        } )
    );

    didMount( () => {
        this$._loadPageData();
    } );
}
