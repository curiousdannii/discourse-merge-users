import AdminUser from 'admin/models/admin-user'
import { ajax } from 'discourse/lib/ajax'
import { setting } from 'discourse/lib/computed'
import showModal from 'discourse/lib/show-modal'

function CancelPromiseChainError() {}

export default Ember.Component.extend({
    formSubmitted: false,
    messageTarget: setting('merge_users_message_target'),

    actions: {
        submit() {
            if (this.get('formSubmitted'))
            {
                return
            }

            const messageTarget = this.get('messageTarget') ? 1 : 0
            const source = this.get('source')
            const target = this.get('target')

            if (!source || !target)
            {
                return bootbox.alert(I18n.t('merge-users.alerts.noempty'))
            }

            this.set('formSubmitted', true)
            ajax('/admin/plugins/merge-users/merge', {
                type: 'post',
                data: {
                    check: 1,
                    source,
                    target,
                }
            }).then( response => {
                const source_user = response.source
                const target_user = response.target

                if (!source_user || !target_user)
                {
                    const errors = []
                    if (!source_user)
                    {
                        errors.push(I18n.t('merge-users.alerts.nouser', {username: source}))
                    }
                    if (!target_user)
                    {
                        errors.push(I18n.t('merge-users.alerts.nouser', {username: target}))
                    }
                    bootbox.alert(errors.join('<br>'))
                    throw new CancelPromiseChainError()
                }

                //return new Promise( (resolve, reject) => bootbox.confirm(I18n.t('merge-users.alerts.confirm', {source, target}), resolve) )
                return new Promise( (resolve, reject) => {
                    const controller = showModal('merge-users-confirmation')
                    controller.setProperties({
                        resolve,
                        source: AdminUser.create(source_user),
                        target: AdminUser.create(target_user),
                    })
                })
            })
            .then( response => {
                if (!response)
                {
                    throw new CancelPromiseChainError()
                }

                return ajax('/admin/plugins/merge-users/merge', {
                    type: 'post',
                    data: {
                        messageTarget,
                        source,
                        target,
                    }
                })
            })
            .then( response => {
                bootbox.alert(I18n.t('merge-users.alerts.begun', {source, target}) + I18n.t(messageTarget ? 'merge-users.alerts.message-both' : 'merge-users.alerts.message-admin'))
                this.setProperties({
                    source: '',
                    target: '',
                })
            })
            .catch( error => {
                if (error instanceof CancelPromiseChainError)
                {
                    return
                }
                if (error.responseJSON && error.responseJSON.errors)
                {
                    bootbox.alert(I18n.t('generic_error_with_reason', {error: error.responseJSON.errors[0]}))
                }
                else
                {
                    bootbox.alert(I18n.t('generic_error'))
                    throw error
                }
            })
            .finally(() => this.set('formSubmitted', false))
        }
    },
})