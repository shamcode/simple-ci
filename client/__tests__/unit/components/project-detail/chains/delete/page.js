import { DI } from 'sham-ui';
import hrefto from 'sham-ui-router/href-to';
import Page from '../../../../../../src/components/project-detail/chains/delete/page.sfc';
import renderer from 'sham-ui-test-helpers';

afterEach( () => {
    DI.bind( 'store', null );
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
    DI.bind( 'store', {
        getProjectChainById: jest.fn().mockReturnValue( Promise.resolve( { project: { id: 1 } } ) ),
        getProjectById: jest.fn().mockReturnValue( Promise.resolve( { project: { id: 1 } } ) )
    } );
    DI.bind( 'router', {
        storage: { params: { id: 1 } },
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( Page, {
        directives: {
            hrefto
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );
