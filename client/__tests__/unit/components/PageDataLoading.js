import PageDataLoading from '../../../src/components/PageDataLoading.sht';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( PageDataLoading, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );
