import setup, { app } from './helpers'
import axios from 'axios';
jest.mock( 'axios' );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
    setup();
} );

it( 'update project', async() => {
    expect.assertions( 7);

    axios
        .useDefaultMocks()
        .use( 'put', '/projects/1', null );

    await app.start();
    await app.project.open();

    await app.click( '[href="projects/1/edit"]' );
    app.checkBody();
    await app.waitRendering();
    app.checkBody();
    expect( document.querySelector( '[name="name"]' ).value ).toBe( axios.defaultMocksData.project.name );
    expect( document.querySelector( '[name="cwd"]' ).value ).toBe( axios.defaultMocksData.project.cwd );

    const formData = {
        name: 'Test name',
        cwd: 'test cwd'
    };
    app.form.fill( 'name', formData.name );
    app.form.fill( 'cwd', formData.cwd );
    await app.form.submit();
    expect( axios.mocks.put ).toHaveBeenCalledTimes( 1 );
    expect( axios.mocks.put.mock.calls[ 0 ][ 1 ] ).toEqual( formData );

    app.checkBody();
} );

