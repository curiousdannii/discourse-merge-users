import AdminUser from 'admin/models/admin-user'
import AdminUserIndex from 'admin/controllers/admin-user-index'

function augmentClasses()
{
    AdminUser.reopen({
        mergeInto() {

            bootbox.prompt(I18n.t("admin.user.merge_into_explaination"), alert)
        }
    })

    AdminUserIndex.reopen({
        actions: {
            mergeInto() {
                return this.get('model').mergeInto()
            }
        }
    })

    try {
    a = new AdminUser()
    b = new AdminUserIndex()
    console.log(a,b)
    } catch (e) {}
}

export default {
    name: 'merge-users',
    initialize(){
        augmentClasses()
    },
}