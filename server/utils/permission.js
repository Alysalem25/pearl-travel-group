const hasPermission = (user, permission) => {
  if (!user || !user.permissions) return false;

  // full access
  if (user.permissions.includes("*")) return true;

  return user.permissions.includes(permission);
};

const isOwnerOrAdmin = (user, resourceUserId) => {
  if (!user) return false;
  // Check if same user
  if (user._id.toString() === resourceUserId.toString()) return true;
  // Check if admin with MANAGE_USERS permission
  return hasPermission(user, "manage_users");
};

module.exports = { hasPermission, isOwnerOrAdmin };