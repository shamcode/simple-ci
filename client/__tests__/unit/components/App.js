import { DI } from 'sham-ui';
import App from '../../../src/components/App.sht';
import hrefto from 'sham-ui-router/href-to';
import renderer from 'sham-ui-test-helpers';
import DummyPage from './DummyPage.sht';

afterEach( () => {
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' ),
        activePageComponent: DummyPage,
        storage: {}
    } );

    const meta = renderer( App, {
        directives: {
            hrefto
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );
