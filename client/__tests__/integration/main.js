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

it( 'main page', async() => {
    expect.assertions( 3 );

    window.localStorage.setItem( 'token', 'test' );

    const getMock = jest.fn().mockReturnValue( Promise.resolve( {
        data: [
            { id: 1, name: 'Test', cwd: 'tmp' },
            { id: 2, name: 'Test2', cwd: 'home' }
        ]
    } ) );
    axios.create.mockImplementation( () => {
        return {
            get: getMock,
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

    const body = document.querySelector( 'body' );

    DI.bind( 'widget-binder', controller );
    const UI = new ShamUI();
    UI.render.FORCE_ALL();
    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
    await flushPromises();
    expect( pretty( body.innerHTML ) ).toMatchSnapshot();
    expect( getMock ).toHaveBeenCalledTimes( 1 );
} );
