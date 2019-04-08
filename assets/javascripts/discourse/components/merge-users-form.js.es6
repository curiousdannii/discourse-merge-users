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
        }
    },
})