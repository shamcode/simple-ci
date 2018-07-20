import { options } from 'sham-ui';
import ConfirmModalTemplate from './ConfirmModal.sht';

export default class ProjectDeleteModal extends ConfirmModalTemplate {
    @options onOk() {}
    @options onCancel() {}
    @options get title() {
        return '';
    }
    @options get body() {
        return '';
    }
    @options get dataSaving() {
        return false;
    }
}
