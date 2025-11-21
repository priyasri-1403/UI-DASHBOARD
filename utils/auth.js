// Simple role-to-permission mapping for frontend RBAC.
// Roles come from Azure AD / Entra ID app roles (claims.roles).

const ROLE_PERMISSIONS = {
  Manager: ['view_project_list', 'view_filters'],
  Admin: ['view_project_list', 'view_filters'],
  Viewer: ['view_project_list'],
};

export function can(permission) {
  const user = window._user || { roles: [] };
  const perms = new Set();

  (user.roles || []).forEach((role) => {
    (ROLE_PERMISSIONS[role] || []).forEach((p) => perms.add(p));
  });

  return perms.has(permission);
}


