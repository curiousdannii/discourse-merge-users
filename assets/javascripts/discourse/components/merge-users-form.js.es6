export default Ember.Component.extend({
    formSubmitted: false,

    actions: {
        submit() {
            const source = this.get('source')
            const target = this.get('target')

            if (!source || !target)
            {
                return bootbox.alert(I18n.t('merge-users.noempty'))
            }

            ajax('/admin/plugins/merge-users/merge', {
                type: 'post',
                data: {
                    check: 1,
                    source,
                    target,
                }
            }).then( response => {
                if ( !response.source || !response.target )
                {
                    const errors = []
                    if ( !response.source )
                    {
                        errors.push(I18n.t('merge-users.nouser', source))
                    }
                    if ( !response.target )
                    {
                        errors.push(I18n.t('merge-users.nouser', target))
                    }
                    return bootbox.alert(errors.join('<br>'))
                }
            })
        }
    },
})