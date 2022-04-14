import { createDI } from 'sham-ui';
import App from '../../../src/components/App.sht';
import hrefto from 'sham-ui-router/lib/href-to';
import renderer from 'sham-ui-test-helpers';
import DummyPage from './DummyPage.sht';

it( 'renders correctly', () => {
    const DI = createDI();
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValue( '/' ),
        activePageComponent: DummyPage,
        storage: {}
    } );

    const meta = renderer( App, {
        DI,
        directives: {
            hrefto
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );
