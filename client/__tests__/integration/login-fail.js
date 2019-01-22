import setup, { app } from './helpers';
import axios from 'axios';
jest.mock( 'axios' );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
    setup( { auth: false } );
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
