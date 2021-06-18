import { createDI } from 'sham-ui';
import Page from '../../../../../../src/components/project-detail/chains/run/page';
import * as directives from 'sham-ui-directives';
import hrefto from 'sham-ui-router/lib/href-to';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const DI = createDI();
    DI.bind( 'store', {
        getProjectChainById: jest.fn().mockReturnValue( Promise.resolve( { project: { id: 1 } } ) ),
        getProjectById: jest.fn().mockReturnValue( Promise.resolve( { project: { id: 1 } } ) )
    } );
    DI.bind( 'router', {
        storage: { params: { id: 1 } },
        generate: jest.fn().mockReturnValueOnce( '/' )
    } );
    const meta = renderer( Page, {
        DI,
        directives: {
            ...directives,
            hrefto
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );
