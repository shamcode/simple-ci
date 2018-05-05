import pretty from 'pretty';
import axios from 'axios';
import ShamUI, { DI } from 'sham-ui';
import controller from '../../src/controllers/main';
jest.mock( 'axios' );

const flushPromises = () => new Promise( resolve => setImmediate( resolve ) );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
} );

it( 'delete project', async() => {
    expect.assertions( 5 );

    const projectData = {
        id: 1,
        name: 'Test',
        cwd: '/tmp/'
    };
    const projectsPromise = Promise.resolve( {
        data: [ projectData ]
    } );
    const projectPromise = Promise.resolve( {
        data: projectData
    } );
    const getMock = jest.fn();
    const deleteMock = jest.fn().mockReturnValue( Promise.resolve() );
    axios.create.mockImplementation( () => {
        return {
            get: getMock,
            delete: deleteMock
        };
    } );

    getMock.mockReturnValueOnce( projectsPromise );
    window.location.href = 'http://simple-ci.example.com';

    DI.bind( 'widget-binder', controller );
    const UI = new ShamUI();
    UI.render.FORCE_ALL();
    await flushPromises();

    getMock.mockReturnValueOnce( projectPromise );
    const body = document.querySelector( 'body' );
    body.querySelector( '.project-card' ).click();
    await flushPromises();

    getMock.mockReturnValueOnce( projectPromise );
    document.querySelector( '[href="projects/1/delete"]').click();
    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
    await flushPromises();
    expect( pretty( body.innerHTML ) ).toMatchSnapshot();

    getMock.mockReturnValueOnce( projectsPromise );
    body.querySelector( '.modal .ok' ).click();
    expect( deleteMock ).toHaveBeenCalledTimes( 1 );
    expect( deleteMock.mock.calls[ 0 ][ 0 ] ).toBe( '/projects/1' );

    await flushPromises();

    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
} );

