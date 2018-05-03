import { options } from 'sham-ui';
import DeleteModalTemplate from './modal.sht'

export default class ProjectDeleteModal extends DeleteModalTemplate {
    @options onOk() {}
    @options onCancel() {}
    @options get project() { return {} }
    @options get dataSaving() { return false; }
}