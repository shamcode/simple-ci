import setup, { app } from '../helpers'
import axios from 'axios';
jest.mock( 'axios' );

beforeEach( () => {
    jest.resetModules();
    jest.clearAllMocks();
    setup();
} );


it( 'run project chain', async () => {
    expect.assertions( 6 );

    const wsMock = {
        send: jest.fn()
    };
    window.WebSocket = jest.fn( () => wsMock );
    axios
        .useDefaultMocks()
        .use( 'post', '/chains/2/run', null );

    await app.start();
    await app.project.open();
    await app.chain.open();
    await app.click( '[href="projects/1/chains/2/run"]' );

    await app.waitRendering();
    app.checkBody();

    await app.click( '.run-project-chain' );
    wsMock.onopen();
    await app.waitRendering();

    expect( wsMock.send.mock.calls.length ).toBe( 1 );
    expect( wsMock.send.mock.calls[ 0 ][ 0 ] ).toBe( '{"chainId":2}' );
    expect( axios.mocks.post ).toHaveBeenCalledTimes( 1 );
    expect( axios.mocks.post.mock.calls[ 0 ][ 0 ] ).toBe( '/chains/2/run' );
    app.checkBody();
} );

