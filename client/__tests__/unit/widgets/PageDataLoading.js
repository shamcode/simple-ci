import PageDataLoading from '../../../src/widgets/PageDataLoading.sht';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( PageDataLoading, {} );
    expect( meta.toJSON() ).toMatchSnapshot();
} );
