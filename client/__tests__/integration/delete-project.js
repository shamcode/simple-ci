import setup, { app } from './helpers'
import axios from 'axios';
jest.mock( 'axios' );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
    setup();
} );

it( 'delete project', async() => {
    expect.assertions( 5 );

    axios
        .useDefaultMocks()
        .use( 'delete', '/projects/1', null );

    await app.start();
    await app.project.open();

    app.click( '[href="projects/1/delete"]' );
    app.checkBody();
    await app.waitRendering();
    app.checkBody();

    await app.modal.ok();
    expect( axios.mocks.delete ).toHaveBeenCalledTimes( 1 );
    expect( axios.mocks.delete.mock.calls[ 0 ][ 0 ] ).toBe( '/projects/1' );
    app.checkBody();
} );

