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

it( 'update project', async() => {
    expect.assertions( 10 );

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
    const putMock = jest.fn().mockReturnValue( Promise.resolve() );
    axios.create.mockImplementation( () => {
        return {
            get: getMock,
            put: putMock,
            interceptors: {
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

    getMock.mockReturnValueOnce( projectPromise );
    const body = document.querySelector( 'body' );
    body.querySelector( '.project-card' ).click();
    await flushPromises();

    getMock.mockReturnValueOnce( projectPromise );
    document.querySelector( '[href="projects/1/edit"]').click();
    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
    await flushPromises();
    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
    expect( body.querySelector( '[name="name"]' ).value ).toBe( projectData.name );
    expect( body.querySelector( '[name="cwd"]' ).value ).toBe( projectData.cwd );


    getMock.mockReturnValueOnce( projectPromise );
    const formData = {
        name: 'Test name',
        cwd: 'test cwd'
    };
    body.querySelector( '[name="name"]' ).value = formData.name;
    body.querySelector( '[name="cwd"]' ).value = formData.cwd;
    body.querySelector( '[type="submit"]' ).click();
    expect( putMock ).toHaveBeenCalledTimes( 1 );
    expect( putMock.mock.calls[ 0 ][ 0 ] ).toBe( '/projects/1' );
    expect( Object.keys( putMock.mock.calls[ 0 ][ 1 ] ) ).toEqual( [ 'name', 'cwd' ] );
    expect( putMock.mock.calls[ 0 ][ 1 ].name ).toEqual( formData.name );
    expect( putMock.mock.calls[ 0 ][ 1 ].cwd ).toEqual( formData.cwd );

    await flushPromises();

    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
} );

