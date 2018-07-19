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
        command: 'echo 1'
    };
    widget.querySelector( '[name="name"]' ).value = formData.name;
    widget.querySelector( '[name="command"]' ).value = formData.command;
    widget.querySelector( '[type="submit"]' ).click();

    expect( onSubmitMock.mock.calls ).toHaveLength( 1 );
    expect( onSubmitMock.mock.calls[ 0 ] ).toHaveLength( 1 );
    const data = onSubmitMock.mock.calls[ 0 ][ 0 ];
    expect( Object.keys( data ) ).toEqual( [ 'name', 'command' ] );
    expect( data.name ).toBe( formData.name );
    expect( data.command ).toBe( formData.command );
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
    expect( onSubmitMock.mock.calls ).toHaveLength( 0 );

    widget.querySelector( '[type="submit"]' ).click();
    expect( onSubmitMock.mock.calls ).toHaveLength( 0 );
} );
