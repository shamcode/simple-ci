import PageContent  from '../../../src/widgets/PageContent.sht';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( PageContent, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );
