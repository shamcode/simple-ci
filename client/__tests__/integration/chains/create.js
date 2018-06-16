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

it( 'create project chain', async() => {
    expect.assertions( 8 );

    window.localStorage.setItem( 'token', 'test' );

    const projectData = {
        id: 1,
        name: 'Test',
        cwd: '/tmp/',
        chains: []
    };
    const projectsPromise = Promise.resolve( {
        data: [ projectData ]
    } );
    const projectPromise = Promise.resolve( {
        data: projectData
    } );
    const getMock = jest.fn();
    const postMock = jest.fn().mockReturnValue( Promise.resolve() );
    axios.create.mockImplementation( () => {
        return {
            get: getMock,
            post: postMock,
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

    document.querySelector( '[href="projects/1/chains/create"]').click();
    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
    await flushPromises();
    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
    const formData = {
        name: 'Test chain name',
    };
    body.querySelector( '[name="name"]' ).value = formData.name;
    body.querySelector( '[type="submit"]' ).click();
    expect( postMock ).toHaveBeenCalledTimes( 1 );
    expect( postMock.mock.calls[ 0 ][ 0 ] ).toBe( '/chains' );
    expect( Object.keys( postMock.mock.calls[ 0 ][ 1 ] ) ).toEqual( [ 'name', 'projectId' ] );
    expect( postMock.mock.calls[ 0 ][ 1 ].name ).toEqual( formData.name );
    expect( postMock.mock.calls[ 0 ][ 1 ].projectId ).toEqual( projectData.id );

    await flushPromises();

    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
} );

