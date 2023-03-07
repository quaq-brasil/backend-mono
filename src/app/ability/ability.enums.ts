export enum WorkspaceAction {
	Manage = 'manage',
	CreateNewPages = 'create_new_pages',
	EditPages = 'edit_pages',
	DeletePages = 'delete_pages',
	EditWorkspace = 'edit_workspace',
	DeleteWorkspace = 'delete_workspace',
	CreateNewRoles = 'create_new_roles',
	AddMembers = 'add_members',
	AddServices = 'add_services',
	EditServices = 'edit_services',
	DeleteServices = 'delete_services',
	ManagePaymentMethod = 'manage_payment_method',
	BillDashboard = 'bill_dashboard',
	ManageWorkspacePermissions = 'manage_workspace_permissions'
}

export enum PagesAction {
	EditTemplates = 'edit_templates',
	DeleteTemplates = 'delete_templates',
	AddTemplates = 'add_templates',
	EditPage = 'edit_page',
	DeletePage = 'delete_page',
	ManagePageDashboard = 'manage_page_dashboard',
	ManageTemplatesChest = 'manage_templates_chest',
	ManageLogs = 'manage_logs',
	ManagePagePermissions = 'manage_page_permissions'
}

export enum TemplatesAction {
	EditTemplate = 'edit_template',
	DeleteTemplate = 'delete_template',
	ManageTemplateDashboard = 'manage_template_dashboard',
	ManageTemplateLogs = 'manage_template_logs',
	ManageTemplatePermissions = 'manage_template_permissions'
}
