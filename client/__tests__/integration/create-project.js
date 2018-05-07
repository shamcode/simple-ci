import pretty from 'pretty';
import axios from 'axios';
import ShamUI, { DI } from 'sham-ui';
import controller from '../../src/controllers/main';
jest.mock( 'axios' );

const flushPromises = () => new Promise( resolve => setImmediate( resolve ) );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
} );

it( 'create project', async() => {
    expect.assertions( 7 );

    const postMock = jest.fn().mockReturnValue( Promise.resolve() );
    axios.create.mockImplementation( () => {
        return {
            get: jest.fn().mockReturnValue( Promise.resolve( {
                data: []
            } ) ),
            post: postMock,
            interceptors: {
                response: {
                    use: () => {}
                }
            }
        };
    } );

    DI.bind( 'widget-binder', controller );
    const UI = new ShamUI();
    UI.render.FORCE_ALL();
    await flushPromises();

    const body = document.querySelector( 'body' );
    body.querySelector( '.project-card-create' ).click();
    expect( pretty( body.innerHTML ) ).toMatchSnapshot();

    const formData = {
        name: 'Test name',
        cwd: 'test cwd'
    };
    body.querySelector( '[name="name"]' ).value = formData.name;
    body.querySelector( '[name="cwd"]' ).value = formData.cwd;
    body.querySelector( '[type="submit"]' ).click();
    expect( postMock ).toHaveBeenCalledTimes( 1 );
    expect( postMock.mock.calls[ 0 ][ 0 ] ).toBe( '/projects' );
    expect( Object.keys( postMock.mock.calls[ 0 ][ 1 ] ) ).toEqual( [ 'name', 'cwd' ] );
    expect( postMock.mock.calls[ 0 ][ 1 ].name ).toEqual( formData.name );
    expect( postMock.mock.calls[ 0 ][ 1 ].cwd ).toEqual( formData.cwd );

    await flushPromises();

    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
} );

