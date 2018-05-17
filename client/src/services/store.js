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
            ( response ) => response,
            ::this._responseFailAuthInterceptor
        );
    }

    get session() {
        return DI.resolve( 'session' );
    }

    _requestAuthInterceptor( request ) {
        if ( !this.session.isAuthenticated && this._isGetTokenRequest( request ) ) {
            return request;
        }
        if ( !this.session.isAuthenticated ) {
            this.session.invalidateSession();
        } else {
            request.headers[ 'Bearer' ] = this.session.token;
            return request;
        }
    }

    _responseFailAuthInterceptor( error ) {
        if ( error.response && 401 === error.response.status ) {
            this.session.invalidateSession();
        }
        return Promise.reject( error );
    }

    getToken( username, password ) {
        return this.axios.post( '/login', { username, password } );
    }

    _isGetTokenRequest( request ) {
        return '/login' === request.url;
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