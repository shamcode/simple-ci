import { $, this$ } from 'sham-ui-macro/ref.macro';


export default function LoadProject( options, didMount ) {
    const dataLoaded = $();
    const project = $();
    const errors = $();

    const state = options( {
        [ dataLoaded ]: false,
        [ project ]: {},
        [ errors ]: []
    } );

    const store = this.DI.resolve( 'store' );
    const router = this.DI.resolve( 'router' );

    this$._loadPageData = () => store.getProjectById( router.storage.params.id ).then(
        ( data ) => state( {
            [ project ]: data.project,
            [ dataLoaded ]: true,
            [ errors ]: []
        } ),
        () => state( {
            [ project ]: { chains: [] },
            [ dataLoaded ]: true,
            [ errors ]: [ 'Load project fail!' ]
        } )
    );

    didMount( () => this$._loadPageData() );
}
