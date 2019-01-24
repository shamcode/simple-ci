import { options } from 'sham-ui';
import ConfirmModalTemplate from './ConfirmModal.sht';

export default class ProjectDeleteModal extends ConfirmModalTemplate {
    @options onOk() {}
    @options onCancel() {}
    @options title = '';
    @options body = '';
    @options dataSaving = false;
}
