import setup, { app } from './helpers'
import axios from 'axios';
jest.mock( 'axios' );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
    setup( { auth: false } );
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

    await app.start();
    app.checkBody();

    expect( getMock ).toHaveBeenCalledTimes( 1 );

    getMock.mockReturnValue( Promise.resolve( { data: [] } ) );
    const formData = {
        username: 'admin',
        password: 'pass'
    };
    app.form.fill( 'username', formData.username );
    app.form.fill( 'password', formData.password );
    await app.form.submit();
    expect( postMock ).toHaveBeenCalledTimes( 1 );
    expect( postMock.mock.calls[ 0 ][ 0 ] ).toBe( '/login' );
    expect( Object.keys( postMock.mock.calls[ 0 ][ 1 ] ) ).toEqual( [ 'username', 'password' ] );
    expect( postMock.mock.calls[ 0 ][ 1 ].username ).toEqual( formData.username );
    expect( postMock.mock.calls[ 0 ][ 1 ].password ).toEqual( formData.password );

    expect( getMock ).toHaveBeenCalledTimes( 2 );
    app.checkBody();
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

    await app.start();
    app.checkBody();
    app.form.fill( 'username', 'admin' );
    app.form.fill( 'password', 'pass' );
    await app.form.submit();
    app.checkBody();
} );
