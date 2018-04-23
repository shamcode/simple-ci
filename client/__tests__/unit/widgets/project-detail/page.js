import Page from '../../../../src/widgets/project-detail/page';
import renderer from 'sham-ui-test-helpers';

afterEach( () => {
    DI.bind( 'store', null );
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
    const storeMock = jest.fn().mockReturnValue( Promise.resolve( { project: { id: 1 } } ) );
    DI.bind( 'store', {
        getProjectById: storeMock
    } );
    DI.bind( 'router', {
        lastRouteResolved: jest.fn().mockReturnValueOnce( { params: { id: 1 }} )
    } );

    const meta = renderer( Page, {} );
    expect( storeMock.mock.calls[ 0 ][ 0 ] ).toBe( 1 );
    expect( meta.toJSON() ).toMatchSnapshot();
} );
