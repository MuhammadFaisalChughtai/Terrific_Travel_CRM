import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import {
  Users,
  Plus,
  Pencil,
  Search,
  Loader2,
  Shield,
  Mail,
  User,
  KeyRound,
  UserCheck,
  UserX,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import Modal from "../components/Modal";

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  roles: z.array(z.string()).min(1, "Select at least one role"),
  isActive: z.boolean().default(true),
  password: z.string().optional(),
});

interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roles: string[];
  agentId?: string | null;
  createdAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string | null;
}

interface RolePermission {
  roleId: string;
  permissionId: string;
  permission: Permission;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
  rolePermissions: RolePermission[];
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("Agent");
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");


  // Fetch agents list
  const { data: agentsData } = useQuery({
    queryKey: ["agents-list"],
    queryFn: async () => {
      const res = await apiClient.get("/agents");
      return res.data.data.items as { id: string; name: string; email: string }[];
    },
  });

  // Fetch users list
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["users-list"],
    queryFn: async () => {
      const res = await apiClient.get("/users");
      return res.data.data.items as UserItem[];
    },
  });

  // Fetch roles list
  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles-list"],
    queryFn: async () => {
      const res = await apiClient.get("/users/roles");
      return res.data.data as Role[];
    },
  });

  // Fetch permissions list
  const { data: permissionsData, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ["permissions-list"],
    queryFn: async () => {
      const res = await apiClient.get("/users/permissions");
      return res.data.data as Permission[];
    },
  });

  // Update role permissions mutation
  const updateRolePermissionsMutation = useMutation({
    mutationFn: async ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) => {
      const res = await apiClient.patch(`/users/roles/${roleId}/permissions`, { permissionIds });
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Role permissions updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["roles-list"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update role permissions.");
    },
  });

  const hasPermission = (role: Role, permissionId: string) => {
    return role.rolePermissions.some((rp) => rp.permissionId === permissionId);
  };

  const handleTogglePermission = (role: Role, permissionId: string) => {
    const currentPermIds = role.rolePermissions.map((rp) => rp.permissionId);
    let nextPermIds: string[];
    if (currentPermIds.includes(permissionId)) {
      nextPermIds = currentPermIds.filter((id) => id !== permissionId);
    } else {
      nextPermIds = [...currentPermIds, permissionId];
    }
    updateRolePermissionsMutation.mutate({ roleId: role.id, permissionIds: nextPermIds });
  };

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClient.post("/users", payload);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("User account created successfully! Credentials email sent to the agent.");
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create user.");
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await apiClient.patch(`/users/${id}`, payload);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("User details updated successfully.");
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update user.");
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.post(`/users/${id}/reset-password`);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Password reset completed! Temporary credentials email sent to the agent.");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    },
  });

  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setSelectedRole("Agent");
    setIsActive(true);
    setPassword("");
    setSelectedAgentId("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserItem) => {
    setSelectedUser(user);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setSelectedRole(user.roles[0] || "Agent");
    setIsActive(user.isActive);
    setPassword("");
    setSelectedAgentId(user.agentId || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      firstName,
      lastName,
      email,
      roles: [selectedRole],
      isActive,
      agentId: selectedRole === "Agent" ? (selectedAgentId || null) : null,
    };

    if (selectedUser) {
      updateUserMutation.mutate({ id: selectedUser.id, payload });
    } else {
      payload.password = password || undefined;
      createUserMutation.mutate(payload);
    }
  };

  const filteredUsers = (usersData || []).filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(term) ||
      u.lastName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.roles.some((r) => r.toLowerCase().includes(term))
    );
  });

  const targetRoleNames = ["Admin", "Manager", "Agent"];
  const displayedRoles = (rolesData || [])
    .filter((r) => targetRoleNames.includes(r.name))
    .sort((a, b) => targetRoleNames.indexOf(a.name) - targetRoleNames.indexOf(b.name));

  const groupedPermissions = (permissionsData || []).reduce((acc, perm) => {
    const prefix = perm.name.split(":")[0] || "other";
    if (!acc[prefix]) {
      acc[prefix] = [];
    }
    acc[prefix].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const groupOrder = ["bookings", "invoices", "customers", "reports", "users", "roles", "permissions", "settings"];
  const sortedGroupKeys = Object.keys(groupedPermissions).sort((a, b) => {
    const indexA = groupOrder.indexOf(a);
    const indexB = groupOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const getGroupLabel = (prefix: string) => {
    switch (prefix) {
      case "bookings":
        return "Bookings Management";
      case "invoices":
        return "Invoices & Billing";
      case "customers":
        return "Customer Accounts";
      case "reports":
        return "Reports & Analytics";
      case "users":
        return "User Management";
      case "roles":
        return "Role Assignments";
      case "permissions":
        return "Access Policies";
      case "settings":
        return "System Settings";
      default:
        return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
  };

  return (
    <div className="space-y-6 font-sans text-xs pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-xl border border-border/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Shield className="text-primary h-5 w-5" />
            RBAC Operators & Users
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Manage system administrators, managers, booking agents, and client roles. Configure system status, deactivations, and reset passwords.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 shadow transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Operator</span>
        </button>
      </div>



      {/* Filters & search panel */}
      <div className="bg-card p-4 rounded-xl border border-border/80 shadow-sm flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search operators by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-secondary/20 border border-border/80 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-card rounded-xl border border-border/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="animate-spin text-primary h-8 w-8" />
            <p className="text-muted-foreground font-medium">Loading operators...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground italic">
            No user accounts found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/15 border-b border-border/80 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  <th className="px-5 py-3">User Name</th>
                  <th className="px-5 py-3">Email Address</th>
                  <th className="px-5 py-3">Role Status</th>
                  <th className="px-5 py-3">Active Status</th>
                  <th className="px-5 py-3">Created On</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredUsers.map((u) => {
                  const isActiveLabel = u.isActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <UserCheck size={9} />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      <UserX size={9} />
                      Inactive
                    </span>
                  );

                  return (
                    <tr key={u.id} className="hover:bg-secondary/5 transition-colors text-[11.5px]">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0 border border-primary/10">
                            {u.firstName.charAt(0)}{u.lastName.charAt(0)}
                          </div>
                          <span className="font-bold text-foreground">
                            {u.firstName} {u.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {u.email}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap gap-1">
                            {u.roles.map((r) => (
                              <span
                                key={r}
                                className="px-2 py-0.5 bg-secondary border border-border text-[9.5px] font-bold rounded-lg text-foreground"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                          {u.agentId && (
                            <span className="text-[9px] text-muted-foreground font-semibold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                              Agent Profile: {(agentsData || []).find((a) => a.id === u.agentId)?.name || "Linked"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {isActiveLabel}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-secondary hover:bg-primary/10 text-foreground hover:text-primary rounded-lg border border-border font-bold text-[10.5px] transition-all"
                            title="Edit user details and roles"
                          >
                            <Pencil size={11} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to reset password for " + u.email + "? This will generate a temporary credential.")) {
                                resetPasswordMutation.mutate(u.id);
                              }
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-secondary hover:bg-amber-500/10 text-foreground hover:text-amber-500 rounded-lg border border-border font-bold text-[10.5px] transition-all"
                            title="Generate a new temporary password"
                          >
                            <KeyRound size={11} />
                            <span>Reset Pass</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Permission Matrix Guide Card */}
      <div className="bg-card p-6 rounded-xl border border-border/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Shield size={16} className="text-primary" />
          Interactive Permission Matrix Reference
        </h3>
        <p className="text-muted-foreground text-xs">
          Reference table summarizing system clearances. Hard deletions are disabled globally for all operators, including Administrators, to preserve secure financial audit trails.
        </p>

        {isLoadingRoles || isLoadingPermissions ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-2">
            <Loader2 className="animate-spin text-primary h-6 w-6" />
            <p className="text-muted-foreground text-[11px]">Loading permissions...</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-border/60 rounded-lg">
            <table className="w-full text-[10.5px] text-left border-collapse">
              <thead>
                <tr className="bg-secondary/25 border-b border-border/60 text-muted-foreground font-bold">
                  <th className="px-4 py-2.5">Module Action</th>
                  {displayedRoles.map((role) => (
                    <th key={role.id} className="px-4 py-2.5 w-32 text-center">
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-foreground">
                {sortedGroupKeys.map((groupKey) => (
                  <React.Fragment key={groupKey}>
                    {/* Header Row for Category */}
                    <tr className="bg-secondary/10">
                      <td
                        colSpan={1 + displayedRoles.length}
                        className="px-4 py-2 font-bold text-primary border-y border-border/40 text-[10px] tracking-wide uppercase"
                      >
                        {getGroupLabel(groupKey)}
                      </td>
                    </tr>
                    {groupedPermissions[groupKey].map((perm) => (
                      <tr key={perm.id} className="hover:bg-secondary/5 transition-colors">
                        <td className="px-4 py-2.5">
                          <div className="font-semibold text-foreground">{perm.description || perm.name}</div>
                          <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{perm.name}</div>
                        </td>
                        {displayedRoles.map((role) => {
                          const checked = hasPermission(role, perm.id);
                          const isMutating = updateRolePermissionsMutation.isPending;
                          
                          // Custom rules / exclusions if any
                          const isDeletePermission = perm.name.endsWith(":delete");

                          return (
                            <td key={role.id} className="px-4 py-2.5 text-center">
                              <div className="flex flex-col items-center justify-center gap-1">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    disabled={isMutating}
                                    onChange={() => handleTogglePermission(role, perm.id)}
                                    className="sr-only peer"
                                  />
                                  <div className="w-7 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                                {isDeletePermission && (
                                  <span className="text-[7.5px] text-rose-500 font-bold block leading-none mt-0.5">
                                    (Blocked API-side)
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Create/Edit Operator */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? "Modify Operator Details" : "Create New Operator Account"}
      >
        <form onSubmit={handleSubmit} className="p-5 space-y-4 font-sans text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Agent"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@terrifictravel.co.uk"
                className="w-full pl-8 pr-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                Role Assignment
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="Admin">Admin (Full System access)</option>
                <option value="Manager">Manager (Supervise bookings)</option>
                <option value="Agent">Agent (Personal bookings)</option>
                <option value="Customer">Customer (Client Account)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                Account Status
              </label>
              <div className="flex items-center gap-3 h-9">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-2 text-xs font-semibold text-foreground">
                    {isActive ? "Enabled" : "Deactivated"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {selectedRole === "Agent" && (
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                Link Agent Profile
              </label>
              <select
                value={selectedAgentId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedAgentId(val);
                  if (val) {
                    const agent = (agentsData || []).find((a) => a.id === val);
                    if (agent) {
                      const nameParts = agent.name.trim().split(/\s+/);
                      setFirstName(nameParts[0] || "");
                      setLastName(nameParts.slice(1).join(" ") || "");
                      setEmail(agent.email);
                    }
                  }
                }}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="">-- No Linked Agent Profile --</option>
                {(agentsData || []).map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          {!selectedUser && (
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                Set Initial Password (Optional)
              </label>
              <div className="relative">
                <Lock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Defaults to: user123"
                  className="w-full pl-8 pr-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-border mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-secondary text-foreground font-bold rounded-lg text-xs hover:bg-secondary/80 transition-all border border-border cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
              className="px-4 py-2 bg-primary text-white font-bold rounded-lg text-xs hover:bg-primary/90 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {(createUserMutation.isPending || updateUserMutation.isPending) && (
                <Loader2 className="animate-spin h-3.5 w-3.5" />
              )}
              {selectedUser ? "Update Profile" : "Create Operator"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
