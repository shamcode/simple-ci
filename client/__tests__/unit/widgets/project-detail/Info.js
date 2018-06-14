import { DI } from 'sham-ui';
import Info from '../../../../src/widgets/project-detail/Info';
import directives from '../../../../src/directives/event-listener';
import renderer from 'sham-ui-test-helpers';

afterEach( () => {
    DI.bind( 'store', null );
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
    DI.bind( 'store', {
        getProjectById: jest.fn().mockReturnValue(
            Promise.resolve( {
                project: { id: 1, chains: [] }
            } )
        )
    } );
    DI.bind( 'router', {
        lastRouteResolved: jest.fn().mockReturnValueOnce( { params: { id: 1 } } ),
        generate: jest.fn().mockReturnValue( '/' )
    } );

    const meta = renderer( Info, {
        directives
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );