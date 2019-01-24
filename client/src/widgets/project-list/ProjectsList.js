import ProjectsListTemplate from './ProjectsList.sht';

export default class extends ProjectsListTemplate {
    paramsForDetailPage( project ) {
        return { id: project.id };
    }
}
