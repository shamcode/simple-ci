import setup, { app } from './helpers'
import axios from 'axios';
jest.mock( 'axios' );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
    setup();
} );

it( 'success registry', async() => {
    expect.assertions( 5 );

    axios
        .useDefaultMocks()
        .use( 'post', '/registry', {} );

    window.__NAVIGO_WINDOW_LOCATION_MOCK__ = 'http://simple-ci.example.com/registry/';

    await app.start();
    app.checkBody();
    expect( axios.mocks.get ).toHaveBeenCalledTimes( 0 );

    window.localStorage.setItem( 'token', 'test' );
    const formData = {
        username: 'admin',
        password: 'pass'
    };
    app.form.fill( 'username', formData.username );
    app.form.fill( 'password', formData.password );
    await app.form.submit();
    expect( axios.mocks.post ).toHaveBeenCalledTimes( 1 );
    expect( axios.mocks.post.mock.calls[ 0 ][ 1 ] ).toEqual( formData );

    expect( window.location.href ).toBe( 'http://localhost:3000/login' );
} );
