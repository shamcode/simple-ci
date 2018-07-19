import setup, { app } from './helpers';
import axios from 'axios';
jest.mock( 'axios' );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
    setup();
} );

it( 'project-detail page', async() => {
    expect.assertions( 2 );

    const project = {
        id: 1,
        name: 'Test',
        cwd: '/tmp/',
        chains: [
            { id: 1, name: 'First chain' },
            { id: 2, name: 'Second chain' }
        ]
    };

    axios
        .use( 'get', '/projects', [ project ] )
        .use( 'get', '/projects/1', project );

    await app.start();
    await app.click( '.project-card' );
    app.checkBody();
    await app.waitRendering();
    app.checkBody();
} );

