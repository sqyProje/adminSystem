import store from '../store'

export function hasPermission(permission) {
  let myPermissions = store.getters.btnPermission;
  return myPermissions.indexOf(permission) > -1;
}
