import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { facilityApi, handleApiSuccess } from "@/services/api";

interface Court {
  id: number;
  name: string;
  sport: string;
  pricePerHour: number;
  status: string;
}

interface CourtManagementProps {
  courts: Court[];
  onUpdate?: () => void;
}

const CourtManagement = ({ courts, onUpdate }: CourtManagementProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    pricePerHour: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      name: "",
      sport: "",
      pricePerHour: 0
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const response = await facilityApi.addCourt(formData);
      const data = await handleApiSuccess(response);
      
      toast("Court added successfully!");
      setShowAddDialog(false);
      resetForm();
      onUpdate?.();
    } catch (error) {
      console.error('Add court error:', error);
      toast(error instanceof Error ? error.message : "Failed to add court");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCourt) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await facilityApi.updateCourt(editingCourt.id, formData);
      const data = await handleApiSuccess(response);
      
      toast("Court updated successfully!");
      setShowEditDialog(false);
      setEditingCourt(null);
      resetForm();
      onUpdate?.();
    } catch (error) {
      console.error('Update court error:', error);
      toast(error instanceof Error ? error.message : "Failed to update court");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (courtId: number) => {
    if (!confirm("Are you sure you want to delete this court?")) return;
    
    try {
      const response = await facilityApi.deleteCourt(courtId);
      const data = await handleApiSuccess(response);
      
      toast("Court deleted successfully!");
      onUpdate?.();
    } catch (error) {
      console.error('Delete court error:', error);
      toast(error instanceof Error ? error.message : "Failed to delete court");
    }
  };

  const openEditDialog = (court: Court) => {
    setEditingCourt(court);
    setFormData({
      name: court.name,
      sport: court.sport,
      pricePerHour: court.pricePerHour
    });
    setShowEditDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-success">Active</Badge>;
      case 'maintenance':
        return <Badge variant="destructive">Maintenance</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const CourtForm = ({ onSubmit, title }: { onSubmit: (e: React.FormEvent) => void; title: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="courtName">Court Name</Label>
        <Input
          id="courtName"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Court 1, Tennis Court A"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sport">Sport</Label>
        <Select value={formData.sport} onValueChange={(value) => setFormData(prev => ({ ...prev, sport: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Badminton">Badminton</SelectItem>
            <SelectItem value="Tennis">Tennis</SelectItem>
            <SelectItem value="Basketball">Basketball</SelectItem>
            <SelectItem value="Football">Football</SelectItem>
            <SelectItem value="Cricket">Cricket</SelectItem>
            <SelectItem value="Table Tennis">Table Tennis</SelectItem>
            <SelectItem value="Squash">Squash</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price per Hour (₹)</Label>
        <Input
          id="price"
          type="number"
          min="0"
          value={formData.pricePerHour}
          onChange={(e) => setFormData(prev => ({ ...prev, pricePerHour: parseInt(e.target.value) || 0 }))}
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => {
          if (title.includes('Add')) {
            setShowAddDialog(false);
          } else {
            setShowEditDialog(false);
            setEditingCourt(null);
          }
          resetForm();
        }}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : title.includes('Add') ? "Add Court" : "Update Court"}
        </Button>
      </div>
    </form>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Court Management</CardTitle>
            <CardDescription>Manage your courts and pricing</CardDescription>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="hero" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Court
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Court</DialogTitle>
                <DialogDescription>
                  Create a new court for your facility
                </DialogDescription>
              </DialogHeader>
              <CourtForm onSubmit={handleAdd} title="Add Court" />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courts.map((court) => (
            <div key={court.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{court.name}</span>
                  {getStatusBadge(court.status)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {court.sport} • ₹{court.pricePerHour}/hour
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openEditDialog(court)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(court.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Court</DialogTitle>
            <DialogDescription>
              Update court information and pricing
            </DialogDescription>
          </DialogHeader>
          <CourtForm onSubmit={handleEdit} title="Update Court" />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CourtManagement;