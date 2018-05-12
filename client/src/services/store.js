import axios from 'axios';
import { DI } from 'sham-ui'

export default class Store {
    constructor() {
        DI.bind( 'store', this );
        this.axios = axios.create( {
            baseURL: 'http://localhost:3001/api/v1/'
        } );
        this.axios.interceptors.request.use(
            ::this._requestAuthInterceptor
        );
        this.axios.interceptors.response.use(
            ::this._responseSuccessAuthInterceptor,
            ::this._responseFailAuthInterceptor
        );
    }

    get session() {
        return DI.resolve( 'session' );
    }

    _requestAuthInterceptor( config ) {
        if ( !this.session.isAuthenticated && '/login' !== config.url ) {
            this.session.invalidateSession();
        } else {
            return config;
        }
    }

    _responseSuccessAuthInterceptor( response ) {
        if ( !this.session.checkToken( response.headers[ 'Bearer' ] ) ) {
            this.session.invalidateSession();
            return Promise.reject();
        }
        return response;
    }

    _responseFailAuthInterceptor( error ) {
        if ( error.response && 403 === error.response.status ) {
            this.session.invalidateSession();
        }
        return Promise.reject( error );
    }

    setAuthHeaders( token ) {
        this.axios.defaults.headers[ 'Bearer' ] = token;
    }

    getToken( username, password ) {
        return this.axios.post( '/login', { username, password } );
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

    deleteProject( id ) {
        return this.axios.delete( `/projects/${id}` );
    }
}