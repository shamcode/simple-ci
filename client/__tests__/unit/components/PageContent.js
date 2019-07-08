import PageContent  from '../../../src/components/PageContent.sht';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( PageContent, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );
