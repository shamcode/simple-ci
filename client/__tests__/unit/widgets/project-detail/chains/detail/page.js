import { DI } from 'sham-ui';
import Page from '../../../../../../src/widgets/project-detail/chains/detail/page';
import renderer from 'sham-ui-test-helpers';


afterEach( () => {
    DI.bind( 'store', null );
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
    DI.bind( 'store', {
        getProjectChainById: jest.fn().mockReturnValue( Promise.resolve( { project: { id: 1 } } ) ),
        getProjectById: jest.fn().mockReturnValue( Promise.resolve( { project: { id: 1 } } ) )
    } );
    DI.bind( 'router', {
        lastRouteResolved: jest.fn().mockReturnValueOnce( { params: { id: 1 } } ),
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );
    const meta = renderer( Page, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );
