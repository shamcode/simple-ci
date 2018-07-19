import setup, { app } from '../helpers';
import axios from 'axios';
jest.mock( 'axios' );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
    setup();
} );

it( 'delete project chain', async () => {
    expect.assertions( 4 );

    axios
        .useDefaultMocks()
        .use( 'delete', '/chains/2', null );

    await app.start();
    await app.project.open();
    await app.chain.open();
    await app.click( '[href="projects/1/chains/2/delete"]' );

    await app.waitRendering();
    app.checkBody();

    await app.modal.ok();

    expect( axios.mocks.delete ).toHaveBeenCalledTimes( 1 );
    expect( axios.mocks.delete.mock.calls[ 0 ][ 0 ] ).toBe( '/chains/2' );
    app.checkBody();
} );

