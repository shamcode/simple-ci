import { createDI } from 'sham-ui';
import Page from '../../../../../../src/components/project-detail/chains/create/page.sfc';
import * as directives from 'sham-ui-directives';
import hrefto from 'sham-ui-router/lib/href-to';
import renderer from 'sham-ui-test-helpers';

const flushPromises = () => new Promise( resolve => setImmediate( resolve ) );

it( 'renders correctly', () => {
    const DI = createDI();
    const storeMock = jest.fn().mockReturnValue( Promise.resolve( { project: { id: 1 } } ) );
    DI.bind( 'store', {
        getProjectById: storeMock
    } );
    DI.bind( 'router', {
        storage: { params: { id: 1 } },
        generate: jest.fn().mockReturnValue( '/' )
    } );

    const meta = renderer( Page, {}, {
        DI,
        directives: {
            ...directives,
            hrefto
        }
    } );
    expect( storeMock.mock.calls[ 0 ][ 0 ] ).toBe( 1 );
    expect( meta.toJSON() ).toMatchSnapshot();
} );


it( 'create fail', async() => {
    expect.assertions( 2 );

    const DI = createDI();
    const createProjectChain = jest.fn();
    DI.bind( 'store', {
        getProjectById: jest.fn().mockReturnValue( Promise.resolve( {
            project: {
                id: 1,
                name: 'Test',
                cwd: '/tmp/'
            }
        } ) ),
        createProjectChain: createProjectChain
    } );
    DI.bind( 'router', {
        storage: { params: { id: 1 } },
        generate: jest.fn().mockReturnValue( '/' )
    } );

    const meta = renderer( Page, {
        DI,
        directives: {
            ...directives,
            hrefto
        }
    } );
    const { ctx: { container } } = meta;
    await flushPromises();

    const formData = {
        name: 'Test name'
    };
    container.querySelector( '[name="name"]' ).value = formData.name;

    createProjectChain.mockReturnValueOnce( Promise.reject() );
    container.querySelector( '[type="submit"]' ).click();
    expect( createProjectChain.mock.calls ).toHaveLength( 1 );

    await flushPromises();
    expect( meta.toJSON() ).toMatchSnapshot();
} );
