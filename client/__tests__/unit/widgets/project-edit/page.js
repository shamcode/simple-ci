import { DI } from 'sham-ui';
import Page from '../../../../src/widgets/project-edit/page';
import disabled from '../../../../src/directives/disabled';
import directives from '../../../../src/directives/event-listener';
import renderer from 'sham-ui-test-helpers';

const flushPromises = () => new Promise( resolve => setImmediate( resolve ) );

afterEach( () => {
    DI.bind( 'store', null );
    DI.bind( 'router', null );
    jest.resetModules();
    jest.clearAllMocks();
} );

it( 'renders correctly', async () => {
    expect.assertions( 5 );

    const storeMock = jest.fn().mockReturnValue( Promise.resolve( {
        project: {
            id: 1,
            name: 'Test',
            cwd: '/tmp/'
        }
    } ) );
    DI.bind( 'store', {
        getProjectById: storeMock
    } );
    DI.bind( 'router', {
        lastRouteResolved: jest.fn().mockReturnValueOnce( { params: { id: 1 } } ),
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( Page, {
        directives: {
            disabled,
            ...directives
        }
    } );
    const { widget: { container } } = meta;
    expect( storeMock.mock.calls[ 0 ][ 0 ] ).toBe( 1 );
    expect( meta.toJSON() ).toMatchSnapshot();

    await flushPromises();
    expect( container.querySelector( '[name="name"]' ).value ).toBe( 'Test' );
    expect( container.querySelector( '[name="cwd"]' ).value ).toBe( '/tmp/' );
    expect( meta.toJSON() ).toMatchSnapshot();
    await flushPromises();
} );

it( 'update fail', async() => {
    expect.assertions( 2 );

    const updateProjectMock = jest.fn();
    DI.bind( 'store', {
        getProjectById: jest.fn().mockReturnValue( Promise.resolve( {
            project: {
                id: 1,
                name: 'Test',
                cwd: '/tmp/'
            }
        } ) ),
        updateProject: updateProjectMock
    } );
    DI.bind( 'router', {
        lastRouteResolved: jest.fn().mockReturnValueOnce( { params: { id: 1 } } ),
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( Page, {
        directives: {
            disabled,
            ...directives
        }
    } );
    const { widget: { container } } = meta;
    await flushPromises();


    updateProjectMock.mockReturnValueOnce( Promise.reject() );
    container.querySelector( '[type="submit"]' ).click();
    expect( updateProjectMock.mock.calls.length ).toBe( 1 );

    await flushPromises();
    expect( meta.toJSON() ).toMatchSnapshot();
} );