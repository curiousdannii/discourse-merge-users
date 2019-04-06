# name: discourse-merge-users
# about: Adds an admin option to merge users
# version: 0.1.0
# authors: Dannii Willis
# url: https://github.com/curiousdannii/discourse-merge-users

add_admin_route 'merge-users.title', 'merge-users'

Discourse::Application.routes.append do
    get '/admin/plugins/merge-users' => 'admin/plugins#index', constraints: StaffConstraint.new
end