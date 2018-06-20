import setup, { app } from './helpers'
import axios from 'axios';
jest.mock( 'axios' );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
    setup();
} );

it( 'main page', async() => {
    expect.assertions( 3 );

    axios
        .use( 'get', '/projects', [
            { id: 1, name: 'Test', cwd: 'tmp' },
            { id: 2, name: 'Test2', cwd: 'home' }
        ] );

    await app.start( false );
    app.checkBody();
    await app.waitRendering();
    app.checkBody();
    expect( axios.mocks.get ).toHaveBeenCalledTimes( 1 );
} );
