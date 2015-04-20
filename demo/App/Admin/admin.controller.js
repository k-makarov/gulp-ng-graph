(function (context) {
    angular.module('admin')
        .controller('adminController', ['$scope', 'RoutesService', 'adminFactory', 'ngDialog', function ($scope, routesService, adminFactory, ngDialog) {
            var ROLES = {
                'admin': 'Администратор',
                'head': 'Руководитель',
                'assistant': 'Ассистент',
                'reception': 'Секретарь приемной',
            };
            var editedUser;

            $scope.addUser = addUser;
            $scope.editUser = editUser;
            $scope.deleteUser = deleteUser;
            $scope.openAddUserDialog = openAddUserDialog;
            $scope.openEditUserDialog = openEditUserDialog;
            $scope.currentUserLogin = context.getCurrentUser().Login;
            $scope.user = {};
            $scope.options = {};

            init();

            function init() {
                getAllUsers();
                getAllRoles();
            }

            function getAllUsers() {
                adminFactory.getAllUsers().success(function (users) {
                    $scope.users = mapUsers(users);
                });
            }

            function mapUsers(users) {
                var mappedUsers = [];
                for (var i = 0; i < users.length; i++) {
                    users[i].RolesString = getRolesString(users[i].Roles);
                    mappedUsers.push(users[i]);
                }
                return mappedUsers;
            }

            function getRolesString(roleCodes) {
                var roleNames = [];
                angular.forEach(roleCodes, function (roleCode) {
                    roleNames.push(mapRole(roleCode).name);
                });
                return roleNames.join(', ');
            }

            function getAllRoles() {
                adminFactory.getAllRoles().success(function (roleCodes) {
                    $scope.roles = mapRoles(roleCodes);
                });
            }

            function mapRoles(roleCodes) {
                var roles = [];
                for (var i = 0; i < roleCodes.length; i++) {
                    roles.push(mapRole(roleCodes[i]));
                }
                return roles;
            }

            function mapRole(roleCode) {
                var roleName = ROLES[roleCode];
                roleName = roleName ? roleName : roleCode;
                return { code: roleCode, name: roleName };
            }

            function addUser() {
                if (!$scope.options.userForm.$valid) {
                    return;
                }
                var user = getUser();
                adminFactory.registerUser(user).then(function () {
                    var newUser = {
                        Login: user.login,
                        Name: user.name,
                        Roles: [user.roleCode],
                        RolesString: getRolesString([user.roleCode])
                    };
                    $scope.users.push(newUser);
                    ngDialog.close();
                }, function (error) {
                    alert(error.data ? error.data : 'При добавлении пользователя произошла ошибка');
                });
            };

            function editUser() {
                if (!$scope.options.userForm.$valid) {
                    return;
                }
                var user = getUser();
                adminFactory.editUser(user).then(function () {
                    editedUser.Login = user.login;
                    editedUser.Name = user.name;
                    editedUser.Roles = [user.roleCode];
                    editedUser.RolesString = getRolesString(editedUser.Roles);
                    ngDialog.close();
                }, function (error) {
                    alert(error.data ? error.data : 'При обновлении пользователя произошла ошибка');
                });
            }

            function getUser() {
               return {
                    login: $scope.user.login,
                    password: $scope.user.password,
                    name: $scope.user.name,
                    roleCode: $scope.user.selectedRole.code
                };
            }

            function deleteUser(user) {
                if (confirm('Вы действительно хотите удалить пользователя "' + user.Name + '"?')) {
                    adminFactory.deleteUser(user.Login).then(function () {
                        $scope.users = _.without($scope.users, _.findWhere($scope.users, { Login: user.Login }));
                    }, function (error) {
                        alert(error.data ? error.data : 'При удалении пользователя произошла ошибка');
                    });
                }
            }

            function openAddUserDialog(user) {
                $scope.options.isEdit = false;
                $scope.options.userDialogHeader = "Добавить пользователя";
                clearFields();
                openUserDialog();
            }

            function openEditUserDialog(user) {
                editedUser = user;
                $scope.options.isEdit = true;
                $scope.options.userDialogHeader = "Редактировать пользователя";
                $scope.user.login = user.Login;
                $scope.user.password = '';
                $scope.user.name = user.Name;
                $scope.user.selectedRole = mapRoles(user.Roles)[0];
                openUserDialog();
            }

            function openUserDialog() {
                ngDialog.open({
                    template: 'editUserDialog',
                    scope: $scope
                });
            }

            function clearFields() {
                $scope.user.login = '';
                $scope.user.password = '';
                $scope.user.name = '';
                $scope.user.selectedRole = '';
            }
        }]);
})(window.GlobalContext);