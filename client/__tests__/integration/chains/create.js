import setup, { app, click } from '../helpers'
import axios from 'axios';
jest.mock( 'axios' );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
    setup();
} );

it( 'create project chain', async() => {
    expect.assertions( 8 );
    axios
        .useDefaultMocks()
        .use( 'post', '/chains', null );

    await app.start();
    await app.project.open();

    document.querySelector( '[href="projects/1/chains/create"]').click();
    app.checkBody();
    await app.waitRendering();
    app.checkBody();

    const formData = {
        name: 'Test chain name',
    };
    app.form.fill( 'name', formData.name );
    await app.form.submit();

    expect( axios.mocks.post ).toHaveBeenCalledTimes( 1 );
    expect( axios.mocks.post.mock.calls[ 0 ][ 0 ] ).toBe( '/chains' );
    expect( Object.keys( axios.mocks.post.mock.calls[ 0 ][ 1 ] ) ).toEqual( [ 'name', 'projectId' ] );
    expect( axios.mocks.post.mock.calls[ 0 ][ 1 ].name ).toEqual( formData.name );
    expect( axios.mocks.post.mock.calls[ 0 ][ 1 ].projectId ).toEqual( axios.defaultMocksData.project.id );


    app.checkBody();
} );

