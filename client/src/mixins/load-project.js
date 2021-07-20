import { $ } from 'sham-ui-macro/ref.macro';


export default function LoadProject( options, update, didMount ) {
    const dataLoaded = $();
    const project = $();
    const errors = $();

    options( {
        [ dataLoaded ]: false,
        [ project ]: {},
        [ errors ]: []
    } );

    const store = this.DI.resolve( 'store' );
    const router = this.DI.resolve( 'router' );

    const _loadPageData = $();
    this[ _loadPageData ] = () => store.getProjectById( router.storage.params.id ).then(
        ( data ) => update( {
            [ project ]: data.project,
            [ dataLoaded ]: true,
            [ errors ]: []
        } ),
        () => update( {
            [ project ]: { chains: [] },
            [ dataLoaded ]: true,
            [ errors ]: [ 'Load project fail!' ]
        } )
    );

    didMount( () => this[ _loadPageData ]() );
}
