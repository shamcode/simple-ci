import setup, { app } from './helpers'
import axios from 'axios';
jest.mock( 'axios' );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
    setup();
} );

it( 'create project', async() => {
    expect.assertions( 7 );

    axios
        .useDefaultMocks()
        .use( 'post', '/projects', null );

    await app.start();
    await app.click( '.project-card-create' );
    app.checkBody();

    const formData = {
        name: 'Test name',
        cwd: 'test cwd'
    };
    app.form.fill( 'name', formData.name );
    app.form.fill( 'cwd', formData.cwd );
    await app.form.submit();
    expect( axios.mocks.post ).toHaveBeenCalledTimes( 1 );
    expect( axios.mocks.post.mock.calls[ 0 ][ 0 ] ).toBe( '/projects' );
    expect( Object.keys( axios.mocks.post.mock.calls[ 0 ][ 1 ] ) ).toEqual( [ 'name', 'cwd' ] );
    expect( axios.mocks.post.mock.calls[ 0 ][ 1 ].name ).toEqual( formData.name );
    expect( axios.mocks.post.mock.calls[ 0 ][ 1 ].cwd ).toEqual( formData.cwd );

    app.checkBody();
} );

