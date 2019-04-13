import { ajax } from 'discourse/lib/ajax'

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
                        errors.push(I18n.t('merge-users.nouser', source))
                    }
                    if (!response.target)
                    {
                        errors.push(I18n.t('merge-users.nouser', target))
                    }
                    this.set('formSubmitted', false)
                    return bootbox.alert(errors.join('<br>'))
                }

                return new Promise( (resolve, reject) => bootbox.confirm(I18n.t('merge-users.confirm', source, target), resolve) )
            })
        }
    },
})