import { DI } from 'sham-ui';
import App from '../../../src/widgets/App.sht';
import renderer from 'sham-ui-test-helpers';
import DummyPage from './DummyPage.sht';

afterEach( () => {
    DI.bind( 'router', null );
} );

it( 'renders correctly', () => {
    DI.bind( 'router', {
        generate: jest.fn().mockReturnValueOnce( '/' ),
        activePageWidget: DummyPage,
        lastRouteResolved: jest.fn().mockReturnValueOnce( '/' )
    } );

    const meta = renderer( App, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );
