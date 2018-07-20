import { DI } from 'sham-ui';
import Page from '../../../../src/widgets/registry/page';
import renderer from 'sham-ui-test-helpers';
import disabled from '../../../../src/directives/disabled';
import directives from '../../../../src/directives/event-listener';

const flushPromises = () => new Promise( resolve => setImmediate( resolve ) );

it( 'renders correctly', () => {
    const meta = renderer( Page, {
        directives: {
            disabled,
            ...directives
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );


it( 'registry fail', async() => {
    expect.assertions( 3 );

    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' ),
        navigate: jest.fn()
    } );
    const registryMock = jest.fn();
    DI.bind( 'store', {
        registry: registryMock.mockReturnValueOnce( Promise.reject() )
    } );

    const meta = renderer( Page, {
        directives: {
            disabled,
            ...directives
        }
    } );
    const formData = {
        username: 'admin',
        password: 'passw0rd'
    };
    const { widget: { container } } = meta;
    container.querySelector( '[name="username"]' ).value = formData.username;
    container.querySelector( '[name="password"]' ).value = formData.password;
    container.querySelector( '[type="submit"]' ).click();

    await flushPromises();

    expect( registryMock.mock.calls ).toHaveLength( 1 );
    expect( registryMock.mock.calls[ 0 ] ).toHaveLength( 2 );
    expect( meta.toJSON() ).toMatchSnapshot();
} );
