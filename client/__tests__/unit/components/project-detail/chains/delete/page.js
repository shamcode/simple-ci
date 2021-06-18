import { onclick, disabled } from 'sham-ui-directives';
import { createDI } from 'sham-ui';
import hrefto from 'sham-ui-router/lib/href-to';
import Page from '../../../../../../src/components/project-detail/chains/delete/page.sfc';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const DI = createDI();
    DI.bind( 'store', {
        getProjectChainById: jest.fn().mockReturnValue( Promise.resolve( { chain: { id: 1 } } ) ),
        getProjectById: jest.fn().mockReturnValue( Promise.resolve( { project: { id: 1 } } ) )
    } );
    DI.bind( 'router', {
        storage: { params: { id: 1 } },
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( Page, {
        DI,
        directives: {
            disabled,
            onclick,
            hrefto
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );
