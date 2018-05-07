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

it( 'project-detail page', async() => {
    expect.assertions( 2 );

    const projectData = {
        id: 1,
        name: 'Test',
        cwd: '/tmp/'
    };

    axios.create.mockImplementation( () => {
        return {
            get: jest.fn()
                .mockReturnValueOnce( Promise.resolve( { data: [ projectData ] } ) )
                .mockReturnValueOnce( Promise.resolve( { data: projectData } ) ),
            interceptors: {
                response: {
                    use: () => {}
                }
            }
        };
    } );

    window.location.href = 'http://simple-ci.example.com';

    DI.bind( 'widget-binder', controller );
    const UI = new ShamUI();
    UI.render.FORCE_ALL();
    await flushPromises();

    const body = document.querySelector( 'body' );
    body.querySelector( '.project-card' ).click();
    expect( pretty( body.innerHTML ) ).toMatchSnapshot();

    await flushPromises();

    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
} );

