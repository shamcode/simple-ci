import renderer from 'sham-ui-test-helpers';
import ChainForm from '../../../../../src/widgets/project-detail/chains/ChainForm';
import directives from '../../../../../src/directives/event-listener';
import disabled from '../../../../../src/directives/disabled';

it( 'renders correctly', () => {
    const meta = renderer( ChainForm, {
        directives: {
            disabled,
            ...directives
        }
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );


it( 'submit form', () => {
    const onSubmitMock = jest.fn();
    const { widget } = renderer( ChainForm, {
        saveButtonText: 'Create',
        directives: {
            disabled,
            ...directives
        },
        onSubmit: onSubmitMock
    } );

    const formData = {
        name: 'Test name',
    };
    widget.querySelector( '[name="name"]' ).value = formData.name;
    widget.querySelector( '[type="submit"]' ).click();

    expect( onSubmitMock.mock.calls.length ).toBe( 1 );
    expect( onSubmitMock.mock.calls[ 0 ].length ).toBe( 1 );
    const data = onSubmitMock.mock.calls[ 0 ][ 0 ];
    expect( Object.keys( data ) ).toEqual( [ 'name' ] );
    expect( data.name ).toBe( formData.name );
} );

it( 'form validation (name)', () => {
    const onSubmitMock = jest.fn();
    const { widget } = renderer( ChainForm, {
        saveButtonText: 'Create',
        directives: {
            disabled,
            ...directives
        },
        onSubmit: onSubmitMock
    } );

    widget.querySelector( '[type="submit"]' ).click();
    expect( onSubmitMock.mock.calls.length ).toBe( 0 );

    widget.querySelector( '[type="submit"]' ).click();
    expect( onSubmitMock.mock.calls.length ).toBe( 0 );
} );
