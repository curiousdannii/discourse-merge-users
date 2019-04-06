import AdminUser from 'admin/models/admin-user'

function augmentAdminUser ()
{
    AdminUser.reopenClass({

        mergeInto() {
            alert('merge!')
        }

    })
}

export default {
    name: 'merge-users',
    initialize(){
        augmentAdminUser()
    },
}