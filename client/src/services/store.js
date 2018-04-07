import axios from 'axios';
import { DI } from 'sham-ui'

const PRIVATE_MEMBERS = new WeakMap();

export default class Store {
    constructor() {
        DI.bind( 'store', this );
        const axiosInstance = axios.create( {
            baseURL: 'http://localhost:3001/api/v1/'
        } );
        PRIVATE_MEMBERS.set( this, axiosInstance );
    }

    getProjects() {
        return PRIVATE_MEMBERS
            .get( this )
            .get( '/projects' )
            .then( ( { data } ) => ( { projects: data } ) );
    }

    createProject( data ) {
        return PRIVATE_MEMBERS
            .get( this )
            .post( '/projects', data );
    }
}