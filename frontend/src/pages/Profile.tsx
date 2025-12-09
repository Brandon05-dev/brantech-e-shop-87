import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield,
  Edit2,
  Save,
  X,
  Loader2,
  Package,
  Heart,
  Settings,
  Home,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { authAPI, orderAPI } from '@/services/api';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  address: {
    street: string;
    city: string;
    county: string;
    postalCode: string;
  };
  isEmailVerified: boolean;
  createdAt: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      county: '',
      postalCode: '',
    },
  });

  useEffect(() => {
    fetchUserData();
    fetchOrders();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.success) {
        const userData = response.data.user;
        setUser(userData);
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
          address: {
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            county: userData.address?.county || '',
            postalCode: userData.address?.postalCode || '',
          },
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch user data:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to view your profile');
        navigate('/auth');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getOrders();
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await authAPI.updateProfile(formData);
      if (response.success) {
        setUser(response.data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          county: user.address?.county || '',
          postalCode: user.address?.postalCode || '',
        },
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">Please login to view your profile</p>
          <Button onClick={() => navigate('/auth')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile - Brantech Electronics</title>
        <meta name="description" content="Manage your account, orders, and preferences" />
      </Helmet>

      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Back Navigation */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Shop</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Go Back</span>
            </Button>
          </div>

          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-2 mb-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member since {formatDate(user.createdAt)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    {isEditing ? 'Update your personal details' : 'Your account information'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                      />
                    ) : (
                      <p className="text-lg">{user.name}</p>
                    )}
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <div className="flex items-center gap-2">
                      <p className="text-lg">{user.email}</p>
                      {user.isEmailVerified ? (
                        <Badge variant="default" className="text-xs">Verified</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Not Verified</Badge>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-lg">{user.phone || 'Not provided'}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                  <CardDescription>
                    {isEditing ? 'Update your delivery address' : 'Your shipping address'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Street */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Street Address</label>
                    {isEditing ? (
                      <Input
                        value={formData.address.street}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, street: e.target.value }
                        })}
                        placeholder="Enter street address"
                      />
                    ) : (
                      <p className="text-lg">{user.address?.street || 'Not provided'}</p>
                    )}
                  </div>

                  {/* City & County */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      {isEditing ? (
                        <Input
                          value={formData.address.city}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            address: { ...formData.address, city: e.target.value }
                          })}
                          placeholder="Enter city"
                        />
                      ) : (
                        <p className="text-lg">{user.address?.city || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">County</label>
                      {isEditing ? (
                        <Input
                          value={formData.address.county}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            address: { ...formData.address, county: e.target.value }
                          })}
                          placeholder="Enter county"
                        />
                      ) : (
                        <p className="text-lg">{user.address?.county || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Postal Code</label>
                    {isEditing ? (
                      <Input
                        value={formData.address.postalCode}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, postalCode: e.target.value }
                        })}
                        placeholder="Enter postal code"
                      />
                    ) : (
                      <p className="text-lg">{user.address?.postalCode || 'Not provided'}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View and track your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                      <Button onClick={() => navigate('/products')}>
                        Browse Products
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold">Order #{order.id}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                            </div>
                            <Badge>{order.status}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">{order.items?.length || 0} items</p>
                            <p className="font-semibold">KSh {order.total?.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Security */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security
                    </h3>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Change Password
                    </Button>
                  </div>

                  {/* Email Notifications */}
                  <div>
                    <h3 className="font-semibold mb-2">Email Notifications</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Order updates</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Promotional emails</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Newsletter</span>
                      </label>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-6 border-t">
                    <h3 className="font-semibold mb-2 text-destructive">Danger Zone</h3>
                    <Button variant="destructive" className="w-full sm:w-auto">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Profile;
