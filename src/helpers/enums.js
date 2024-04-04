const Roles = {
	OPTIONAL: -1,
	LEARNER: 0,
	TEACHER: 1,
	MARKETER: 3,
	OPERATION: 4,
	JUNIOR_CRM: 5,
	SENIOR_CRM: 6,
	ADMIN: 10,
};

const Permissions = {
	PERMISSION_FULL_ACCESS: "permission:full_access",

	PERMISSION_CREATE: "permission:create",
	PERMISSION_READ: "permission:read",
	PERMISSION_UPDATE: "permission:update",
	PERMISSION_DELETE: "permission:delete",

	/**
	 * video permission
	 */

	PERMISSION_VIDEO_UPLOAD: "permission:video_upload",
	PERMISSION_VIDEO_DELETE: "permission:video_delete",
	PERMISSION_VIDEO_UPDATE: "permission:video_update",
	PERMISSION_VIDEO_READ: "permission:video_read",
	PERMISSION_VIDEO_FULL_ACCESS: "permission:video_full_access",
};

module.exports = {
	Roles,
	Permissions,
};
