import setup, { app } from '../helpers';
import axios from 'axios';
jest.mock( 'axios' );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
    setup();
} );

it( 'update project chain', async() => {
    expect.assertions( 9 );

    axios
        .useDefaultMocks()
        .use( 'put', '/chains/2', null );

    await app.start();
    await app.project.open();
    await app.chain.open();
    await app.click( '[href="projects/1/chains/2"]' );

    await app.waitRendering();
    app.checkBody();

    expect( document.querySelector( '[name="name"]' ).value ).toBe(
        axios.defaultMocksData.chain.name
    );
    expect( document.querySelector( '[name="command"]' ).value ).toBe(
        axios.defaultMocksData.chain.command
    );

    const formData = {
        name: 'Test chain name',
        command: 'echo 2'
    };
    app.form.fill( 'name', formData.name );
    app.form.fill( 'command', formData.command );
    await app.form.submit();

    expect( axios.mocks.put ).toHaveBeenCalledTimes( 1 );
    expect( axios.mocks.put.mock.calls[ 0 ][ 0 ] ).toBe( '/chains/2' );
    expect( Object.keys( axios.mocks.put.mock.calls[ 0 ][ 1 ] ) ).toEqual( [ 'name', 'command' ] );
    expect( axios.mocks.put.mock.calls[ 0 ][ 1 ].name ).toEqual( formData.name );
    expect( axios.mocks.put.mock.calls[ 0 ][ 1 ].command ).toEqual( formData.command );
    app.checkBody();
} );


