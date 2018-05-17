import pretty from 'pretty';
import axios from 'axios';
import ShamUI, { DI } from 'sham-ui';
import controller from '../../src/controllers/main';
jest.mock( 'axios' );

const flushPromises = () => new Promise( resolve => setImmediate( resolve ) );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
    window.requestAnimationFrame = ( cb ) => {
        setImmediate( cb )
    };
    const storage = {};
    window.localStorage = {
        getItem( key ) { return storage[ key ] || null; },
        setItem( key, value ) { storage[ key ] = value; },
        removeItem( key ) { delete storage[ key ]; }
    };
    document.querySelector( 'body' ).innerHTML = '';
} );

it( 'success login', async() => {
    expect.assertions( 9 );

    const interceptors = {};
    const getMock = jest.fn( () => {
        return Promise.resolve( { headers: {} } ).then(
            response => interceptors.success( response )
        );
    } );
    const postMock = jest.fn().mockReturnValue( Promise.resolve( {
        data: {
            token: 'TOKEN'
        }
    } ) );
    axios.create.mockImplementation( () => {
        return {
            defaults: {
                headers: {}
            },
            get: getMock,
            interceptors: {
                request: {
                    use: () => {}
                },
                response: {
                    use: ( success, fail ) => {
                        interceptors.success = success;
                        interceptors.fail = fail;
                    }
                }
            },
            post: postMock
        };
    } );

    window.location.href = 'http://simple-ci.example.com/';

    const body = document.querySelector( 'body' );

    DI.bind( 'widget-binder', controller );
    const UI = new ShamUI();
    UI.render.FORCE_ALL();
    await flushPromises();
    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
    expect( getMock ).toHaveBeenCalledTimes( 1 );

    getMock.mockReturnValue( Promise.resolve( { data: [] } ) );
    const formData = {
        username: 'admin',
        password: 'pass'
    };
    body.querySelector( '[name="username"]' ).value = formData.username;
    body.querySelector( '[name="password"]' ).value = formData.password;
    body.querySelector( '[type="submit"]' ).click();
    expect( postMock ).toHaveBeenCalledTimes( 1 );
    expect( postMock.mock.calls[ 0 ][ 0 ] ).toBe( '/login' );
    expect( Object.keys( postMock.mock.calls[ 0 ][ 1 ] ) ).toEqual( [ 'username', 'password' ] );
    expect( postMock.mock.calls[ 0 ][ 1 ].username ).toEqual( formData.username );
    expect( postMock.mock.calls[ 0 ][ 1 ].password ).toEqual( formData.password );

    await flushPromises();

    expect( getMock ).toHaveBeenCalledTimes( 2 );
    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
} );

it( 'fail login (invalid header)', async() => {
    expect.assertions( 2 );

    const interceptors = {};
    const getMock = jest.fn( () => {
        return Promise.resolve( { headers: {} } ).then(
            response => interceptors.success( response )
        );
    } );
    axios.create.mockImplementation( () => {
        return {
            defaults: {
                headers: {}
            },
            get: getMock,
            interceptors: {
                request: {
                    use: () => {}
                },
                response: {
                    use: ( success, fail ) => {
                        interceptors.success = success;
                        interceptors.fail = fail;
                    }
                }
            },
            post: jest.fn().mockReturnValue( Promise.resolve() )
        };
    } );

    window.location.href = 'http://simple-ci.example.com/';

    const body = document.querySelector( 'body' );

    DI.bind( 'widget-binder', controller );
    const UI = new ShamUI();
    UI.render.FORCE_ALL();
    await flushPromises();
    expect( pretty( body.innerHTML ) ).toMatchSnapshot();

    const formData = {
        username: 'admin',
        password: 'pass'
    };
    body.querySelector( '[name="username"]' ).value = formData.username;
    body.querySelector( '[name="password"]' ).value = formData.password;
    body.querySelector( '[type="submit"]' ).click();

    await flushPromises();
    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
} );
