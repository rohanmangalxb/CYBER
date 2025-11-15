import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Trash2, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'analyst' | 'viewer';
  created_at: string;
}

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  details: any;
  created_at: string;
}

export const UserRoleManagement = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'analyst' | 'viewer'>('viewer');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchAuditLogs();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const handleAddRole = async () => {
    if (!newUserEmail) {
      toast({
        title: "Error",
        description: "Please enter a user email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, you would need to get the user_id from the email
      // For now, we'll show a message that this needs to be done through admin panel
      
      await supabase.from('audit_logs').insert([{
        action: 'assign_role',
        resource_type: 'user_roles',
        details: {
          email: newUserEmail,
          role: newUserRole
        }
      }]);

      toast({
        title: "Role Assignment Pending",
        description: `Role assignment for ${newUserEmail} has been logged. This requires admin approval.`,
      });

      setNewUserEmail('');
      fetchAuditLogs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      await supabase.from('audit_logs').insert([{
        action: 'remove_role',
        resource_type: 'user_roles',
        resource_id: roleId
      }]);

      toast({
        title: "Success",
        description: "Role removed successfully",
      });

      fetchRoles();
      fetchAuditLogs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'analyst':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'viewer':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Role Management
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage user permissions and access levels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="User email address"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="flex gap-2">
              <Select value={newUserRole} onValueChange={(value: any) => setNewUserRole(value)}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddRole} disabled={isLoading} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-background/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-foreground">
                  {roles.filter(r => r.role === 'admin').length}
                </div>
                <div className="text-sm text-muted-foreground">Admins</div>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-foreground">
                  {roles.filter(r => r.role === 'analyst').length}
                </div>
                <div className="text-sm text-muted-foreground">Analysts</div>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-foreground">
                  {roles.filter(r => r.role === 'viewer').length}
                </div>
                <div className="text-sm text-muted-foreground">Viewers</div>
              </CardContent>
            </Card>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-foreground">User ID</TableHead>
                  <TableHead className="text-foreground">Role</TableHead>
                  <TableHead className="text-foreground">Created At</TableHead>
                  <TableHead className="text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No roles assigned yet
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id} className="bg-background">
                      <TableCell className="font-mono text-sm text-foreground">
                        {role.user_id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(role.role)}>
                          {role.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(role.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Audit Logs</CardTitle>
          <CardDescription className="text-muted-foreground">
            Recent user actions and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-foreground">Timestamp</TableHead>
                  <TableHead className="text-foreground">Action</TableHead>
                  <TableHead className="text-foreground">Resource</TableHead>
                  <TableHead className="text-foreground">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No audit logs available
                    </TableCell>
                  </TableRow>
                ) : (
                  auditLogs.map((log) => (
                    <TableRow key={log.id} className="bg-background">
                      <TableCell className="text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-foreground font-medium">
                        {log.action.replace(/_/g, ' ').toUpperCase()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {log.resource_type}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {JSON.stringify(log.details).substring(0, 50)}...
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};