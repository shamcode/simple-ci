import { createDI } from 'sham-ui';
import Page from '../../../../src/components/registry/page.sfc';
import renderer from 'sham-ui-test-helpers';
import * as directives from 'sham-ui-directives';

const flushPromises = () => new Promise( resolve => setImmediate( resolve ) );

it( 'renders correctly', () => {
    const meta = renderer( Page, {}, {
        directives
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );


it( 'registry fail', async() => {
    expect.assertions( 3 );

    const DI = createDI();
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValue( '/' ),
        navigate: jest.fn()
    } );
    const registryMock = jest.fn();
    DI.bind( 'store', {
        registry: registryMock.mockReturnValueOnce( Promise.reject() )
    } );

    const meta = renderer( Page, {}, {
        DI,
        directives
    } );
    const formData = {
        username: 'admin',
        password: 'passw0rd'
    };
    const { ctx: { container } } = meta;
    container.querySelector( '[name="username"]' ).value = formData.username;
    container.querySelector( '[name="password"]' ).value = formData.password;
    container.querySelector( '[type="submit"]' ).click();

    await flushPromises();

    expect( registryMock.mock.calls ).toHaveLength( 1 );
    expect( registryMock.mock.calls[ 0 ] ).toHaveLength( 2 );
    expect( meta.toJSON() ).toMatchSnapshot();
} );
