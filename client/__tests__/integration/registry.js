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
        getItem( key ) {
            return storage[ key ] || null;
        },
        setItem( key, value ) {
            storage[ key ] = value;
        },
        removeItem( key ) {
            delete storage[ key ];
        }
    };
    document.querySelector( 'body' ).innerHTML = '';
    window.location.hash = '';
    delete window.__NAVIGO_WINDOW_LOCATION_MOCK__;
    history.pushState( {}, '', '' );
} );

afterEach( () => {
    window.onpopstate = window.onhashchange = null;
} );

it( 'success registry', async() => {
    expect.assertions( 8 );

    const getMock = jest.fn();
    const postMock = jest.fn().mockReturnValue( Promise.resolve( {
        data: {}
    } ) );
    axios.create.mockImplementation( () => {
        return {
            defaults: {
                headers: {}
            },
            get: getMock,
            interceptors: {
                request: {
                    use: () => {
                    }
                },
                response: {
                    use: () => {
                    }
                }
            },
            post: postMock
        };
    } );

    window.__NAVIGO_WINDOW_LOCATION_MOCK__ = 'http://simple-ci.example.com/registry/';

    const body = document.querySelector( 'body' );

    DI.bind( 'widget-binder', controller );
    const UI = new ShamUI();
    UI.render.FORCE_ALL();
    await flushPromises();
    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
    expect( getMock ).toHaveBeenCalledTimes( 0 );

    window.localStorage.setItem( 'token', 'test' );
    const formData = {
        username: 'admin',
        password: 'pass'
    };
    body.querySelector( '[name="username"]' ).value = formData.username;
    body.querySelector( '[name="password"]' ).value = formData.password;
    body.querySelector( '[type="submit"]' ).click();
    expect( postMock ).toHaveBeenCalledTimes( 1 );
    expect( postMock.mock.calls[ 0 ][ 0 ] ).toBe( '/registry' );
    expect( Object.keys( postMock.mock.calls[ 0 ][ 1 ] ) ).toEqual( [ 'username', 'password' ] );
    expect( postMock.mock.calls[ 0 ][ 1 ].username ).toEqual( formData.username );
    expect( postMock.mock.calls[ 0 ][ 1 ].password ).toEqual( formData.password );

    await flushPromises();
    expect( window.location.href ).toBe( 'http://localhost:3000/login' );
} );
