import setup, { flushPromises } from './helpers'
import pretty from 'pretty';
import axios from 'axios';
import ShamUI, { DI } from 'sham-ui';
import controller from '../../src/controllers/main';
jest.mock( 'axios' );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
    setup();
} );

it( 'project-detail page', async() => {
    expect.assertions( 2 );

    window.localStorage.setItem( 'token', 'test' );

    const projectData = {
        id: 1,
        name: 'Test',
        cwd: '/tmp/',
        chains: [
            { id: 1, name: 'First chain' },
            { id: 2, name: 'Second chain' }
        ]
    };

    axios.create.mockImplementation( () => {
        return {
            get: jest.fn()
                .mockReturnValueOnce( Promise.resolve( { data: [ projectData ] } ) )
                .mockReturnValueOnce( Promise.resolve( { data: projectData } ) ),
            interceptors: {
                request: {
                    use: () => {}
                },
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

