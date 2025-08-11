import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock } from 'lucide-react';

const AdminAccessDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAdminAccess = () => {
    setIsOpen(false);
    navigate('/admin/login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
          <Shield className="h-4 w-4 mr-2" />
          Admin Access
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-600" />
            Administrator Access
          </DialogTitle>
          <DialogDescription>
            This area is restricted to system administrators only. Please confirm your administrative privileges.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-200">
            <Lock className="h-12 w-12 text-orange-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Restricted Area</h3>
            <p className="text-sm text-orange-700 mb-4">
              You are about to access the administrative dashboard. Only authorized personnel should proceed.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAdminAccess}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Continue to Admin Login
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAccessDialog;