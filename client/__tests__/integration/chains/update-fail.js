import setup, { app } from '../helpers';
import axios from 'axios';
jest.mock( 'axios' );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
    setup();
} );

it( 'fail update project chain', async() => {
    expect.assertions( 5 );

    axios
        .useDefaultMocks()
        .use( 'put', '/chains/2', null, false );

    await app.start();
    await app.project.open();
    await app.chain.open();

    await app.click( '[href="projects/1/chains/2"]' );

    await app.waitRendering();
    app.checkBody();

    await app.form.submit();
    expect( axios.mocks.put ).toHaveBeenCalledTimes( 1 );
    expect( axios.mocks.put.mock.calls[ 0 ][ 0 ] ).toBe( '/chains/2' );
    expect( Object.keys( axios.mocks.put.mock.calls[ 0 ][ 1 ] ) ).toEqual( [ 'name', 'command' ] );
    app.checkBody();
} );

