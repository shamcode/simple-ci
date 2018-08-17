import ProjectForm from '../../../src/widgets/ProjectForm';
import directives from 'sham-ui-directives';
import renderer from 'sham-ui-test-helpers';

it( 'renders correctly', () => {
    const meta = renderer( ProjectForm, {
        directives
    } );
    expect( meta.toJSON() ).toMatchSnapshot();
} );

it( 'submit form', () => {
    const onSubmitMock = jest.fn();
    const { widget } = renderer( ProjectForm, {
        saveButtonText: 'Create',
        directives,
        onSubmit: onSubmitMock
    } );

    const formData = {
        name: 'Test name',
        cwd: 'test cwd'
    };
    widget.querySelector( '[name="name"]' ).value = formData.name;
    widget.querySelector( '[name="cwd"]' ).value = formData.cwd;
    widget.querySelector( '[type="submit"]' ).click();

    expect( onSubmitMock.mock.calls ).toHaveLength( 1 );
    expect( onSubmitMock.mock.calls[ 0 ] ).toHaveLength( 1 );
    const data = onSubmitMock.mock.calls[ 0 ][ 0 ];
    expect( Object.keys( data ) ).toEqual( [ 'name', 'cwd' ] );
    expect( data.name ).toBe( formData.name );
    expect( data.cwd ).toBe( formData.cwd );
} );

it( 'form validation (name)', () => {
    const onSubmitMock = jest.fn();
    const { widget } = renderer( ProjectForm, {
        saveButtonText: 'Create',
        directives,
        onSubmit: onSubmitMock
    } );

    widget.querySelector( '[type="submit"]' ).click();
    expect( onSubmitMock.mock.calls ).toHaveLength( 0 );

    widget.querySelector( '[name="cwd"]' ).value = 'test';
    widget.querySelector( '[type="submit"]' ).click();
    expect( onSubmitMock.mock.calls ).toHaveLength( 0 );
} );

it( 'form validation (cwd)', () => {
    const onSubmitMock = jest.fn();
    const { widget } = renderer( ProjectForm, {
        saveButtonText: 'Create',
        directives,
        onSubmit: onSubmitMock
    } );

    widget.querySelector( '[type="submit"]' ).click();
    expect( onSubmitMock.mock.calls ).toHaveLength( 0 );

    widget.querySelector( '[name="name"]' ).value = 'test';
    widget.querySelector( '[type="submit"]' ).click();
    expect( onSubmitMock.mock.calls ).toHaveLength( 0 );
} );
