import { DI } from 'sham-ui';
import Page from '../../../../../../src/widgets/project-detail/chains/run/page';
import directives from '../../../../../../src/directives/event-listener';
import disabled from '../../../../../../src/directives/disabled';
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
        lastRouteResolved: jest.fn().mockReturnValueOnce( { params: { id: 1 }} ),
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );
    const meta = renderer( Page, {
        directives: {
            disabled,
            ...directives
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );