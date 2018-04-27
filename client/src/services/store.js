import axios from 'axios';
import { DI } from 'sham-ui'

export default class Store {
    constructor() {
        DI.bind( 'store', this );
        this.axios = axios.create( {
            baseURL: 'http://localhost:3001/api/v1/'
        } );
    }

    getProjects() {
        return this.axios
            .get( '/projects' )
            .then( ( { data } ) => ( { projects: data } ) );
    }

    getProjectById( id ) {
        return this.axios
            .get( `/projects/${id}` )
            .then( ( { data } ) => ( { project: data } ) );
    }

    createProject( data ) {
        return this.axios.post( '/projects', data );
    }

    updateProject( id, data ) {
        return this.axios.put( `/projects/${id}`, data );
    }
}