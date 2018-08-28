import { DI } from 'sham-ui';
import ProjectsPage from '../../../../src/widgets/project-list/page';
import * as directives from 'sham-ui-directives';
import renderer from 'sham-ui-test-helpers';

afterEach( () => {
    DI.bind( 'store', null );
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
    const storeMock = jest.fn().mockReturnValue( Promise.resolve( { projects: [] } ) );
    DI.bind( 'store', {
        getProjects: storeMock
    } );
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( ProjectsPage, { directives } );
    expect( storeMock.mock.calls ).toHaveLength( 1 );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

it( 'render errors', () => {
    const storeMock = jest.fn().mockReturnValue( Promise.reject() );
    DI.bind( 'store', {
        getProjects: storeMock
    } );
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( ProjectsPage, { directives } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );
