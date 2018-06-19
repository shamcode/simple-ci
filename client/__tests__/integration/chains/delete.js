import setup, { flushPromises } from '../helpers'
import pretty from 'pretty';
import axios from 'axios';
import ShamUI, { DI } from 'sham-ui';
import controller from '../../../src/controllers/main';
jest.mock( 'axios' );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
    setup();
} );

it( 'delete project chain', async () => {
    expect.assertions( 4 );

    window.localStorage.setItem( 'token', 'test' );

    const chainData = {
        id: 2,
        name: 'Test chain'
    };

    const projectData = {
        id: 1,
        name: 'Test',
        cwd: '/tmp/',
        chains: [ chainData ]
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
            delete: deleteMock,
            interceptors: {
                request: {
                    use: () => {}
                },
                response: {
                    use: () => {}
                }
            }
        };
    } );

    getMock.mockReturnValueOnce( projectsPromise );
    window.location.href = 'http://simple-ci.example.com';

    DI.bind( 'widget-binder', controller );
    const UI = new ShamUI();
    UI.render.FORCE_ALL();
    await flushPromises();

    getMock.mockReturnValue( projectPromise );
    const body = document.querySelector( 'body' );
    body.querySelector( '.project-card' ).click();
    await flushPromises();

    document.querySelector( '.project-chain').click();

    getMock.mockReturnValue(
        Promise.resolve( {
            data: chainData
        } )
    );
    document.querySelector( '[href="projects/1/chains/2/delete"]').click();
    await flushPromises();
    expect( pretty( body.innerHTML ) ).toMatchSnapshot();

    getMock.mockReturnValue( projectPromise );
    body.querySelector( '.modal .ok' ).click();
    expect( deleteMock ).toHaveBeenCalledTimes( 1 );
    expect( deleteMock.mock.calls[ 0 ][ 0 ] ).toBe( '/chains/2' );

    await flushPromises();

    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
} );

