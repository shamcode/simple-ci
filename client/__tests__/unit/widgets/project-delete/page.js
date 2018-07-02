import { DI } from 'sham-ui';
import Page from '../../../../src/widgets/project-delete/page';
import disabled from '../../../../src/directives/disabled';
import directives from '../../../../src/directives/event-listener';
import renderer from 'sham-ui-test-helpers';

const flushPromises = () => new Promise( resolve => setImmediate( resolve ) );

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
        lastRouteResolved: jest.fn().mockReturnValueOnce( { params: { id: 1 } } ),
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( Page, {
        directives: {
            disabled,
            ...directives
        }
    } );
    expect( storeMock.mock.calls[ 0 ][ 0 ] ).toBe( 1 );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

it( 'render errors', async () => {
    expect.assertions( 1 );

    const storeMock = jest.fn().mockReturnValue( Promise.reject() );
    DI.bind( 'store', {
        getProjectById: storeMock
    } );
    DI.bind( 'router', {
        lastRouteResolved: jest.fn().mockReturnValueOnce(),
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( Page, {
        directives: {
            disabled,
            ...directives
        }
    } );
    await flushPromises();

    expect( meta.toJSON() ).toMatchSnapshot();
} );

it( 'delete fail', async() => {
    expect.assertions( 4 );

    const deleteProject = jest.fn();
    DI.bind( 'store', {
        getProjectById: jest.fn().mockReturnValue( Promise.resolve( {
            project: {
                id: 1,
                name: 'Test',
                cwd: '/tmp/'
            }
        } ) ),
        deleteProject: deleteProject
    } );
    const navigateMock = jest.fn();
    DI.bind( 'router', {
        lastRouteResolved: jest.fn().mockReturnValue( { params: { id: 1 } } ),
        generate: jest.fn().mockReturnValue( '/' ),
        navigate: navigateMock
    } );

    const meta = renderer( Page, {
        directives: {
            disabled,
            ...directives
        }
    } );
    const { widget: { container } } = meta;
    await flushPromises();

    deleteProject.mockReturnValueOnce( Promise.reject() );
    container.querySelector( '.ok' ).click();
    await flushPromises();

    expect( deleteProject.mock.calls.length ).toBe( 1 );
    expect( navigateMock.mock.calls.length ).toBe( 1 );
    expect( navigateMock.mock.calls[ 0 ][ 0 ] ).toBe( '/' );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

it( 'cancel', async() => {
    expect.assertions( 2 );

    DI.bind( 'store', {
        getProjectById: jest.fn().mockReturnValue( Promise.resolve( {
            project: {
                id: 1,
                name: 'Test',
                cwd: '/tmp/'
            }
        } ) )
    } );
    const navigateMock = jest.fn();
    DI.bind( 'router', {
        lastRouteResolved: jest.fn().mockReturnValue( { params: { id: 1 } } ),
        generate: jest.fn().mockReturnValue( '/' ),
        navigate: navigateMock
    } );

    const meta = renderer( Page, {
        directives: {
            disabled,
            ...directives
        }
    } );
    const { widget: { container } } = meta;
    await flushPromises();

    container.querySelector( '.cancel' ).click();
    expect( navigateMock.mock.calls.length ).toBe( 1 );
    expect( navigateMock.mock.calls[ 0 ][ 0 ] ).toBe( '/' );

    await flushPromises();
} );