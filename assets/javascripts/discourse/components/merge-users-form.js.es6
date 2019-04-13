import { ajax } from 'discourse/lib/ajax'

function CancelPromiseChainError() {}

export default Ember.Component.extend({
    formSubmitted: false,

    actions: {
        submit() {
            if (this.get('formSubmitted'))
            {
                return
            }

            const source = this.get('source')
            const target = this.get('target')

            if (!source || !target)
            {
                return bootbox.alert(I18n.t('merge-users.noempty'))
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
                if (!response.source || !response.target)
                {
                    const errors = []
                    if (!response.source)
                    {
                        errors.push(I18n.t('merge-users.nouser', {username: source}))
                    }
                    if (!response.target)
                    {
                        errors.push(I18n.t('merge-users.nouser', {username: target}))
                    }
                    bootbox.alert(errors.join('<br>'))
                    throw new CancelPromiseChainError()
                }

                return new Promise( (resolve, reject) => bootbox.confirm(I18n.t('merge-users.confirm', {source, target}), resolve) )
            })
            .then( response => {
                if (!response)
                {
                    throw new CancelPromiseChainError()
                }

                return ajax('/admin/plugins/merge-users/merge', {
                    type: 'post',
                    data: {
                        source,
                        target,
                    }
                })
            })
            .then( response => {
                bootbox.alert(I18n.t('merge-users.begun', {source, target}))
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
                }
            })
            .finally(() => this.set('formSubmitted', false))
        }
    },
})