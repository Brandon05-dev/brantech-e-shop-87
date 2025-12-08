import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Store,
  Mail,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Palette,
  Save,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Store Settings
    storeName: 'Brantech',
    storeEmail: 'info@brantech.co.ke',
    storePhone: '+254 712 345 678',
    storeAddress: 'Nairobi, Kenya',
    storeDescription: 'Premium tech products and accessories',
    
    // Notifications
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    customerNotifications: true,
    
    // Payment Settings
    mpesaEnabled: true,
    cardPaymentEnabled: true,
    cashOnDeliveryEnabled: true,
    
    // Tax & Shipping
    taxRate: '16',
    shippingFee: '500',
    freeShippingThreshold: '5000',
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your store settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="general">
            <Store className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="shipping">
            <Globe className="h-4 w-4 mr-2" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <div>
              <h3 className="font-display text-xl font-bold mb-4">Store Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) => handleChange('storeName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email Address</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => handleChange('storeEmail', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storePhone">Phone Number</Label>
                    <Input
                      id="storePhone"
                      value={settings.storePhone}
                      onChange={(e) => handleChange('storePhone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeAddress">Address</Label>
                    <Input
                      id="storeAddress"
                      value={settings.storeAddress}
                      onChange={(e) => handleChange('storeAddress', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    value={settings.storeDescription}
                    onChange={(e) => handleChange('storeDescription', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-display text-xl font-bold mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your store
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium">Order Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new orders are placed
                  </p>
                </div>
                <Switch
                  checked={settings.orderNotifications}
                  onCheckedChange={(checked) => handleChange('orderNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Alert when products are running low
                  </p>
                </div>
                <Switch
                  checked={settings.lowStockAlerts}
                  onCheckedChange={(checked) => handleChange('lowStockAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium">Customer Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Send automated emails to customers
                  </p>
                </div>
                <Switch
                  checked={settings.customerNotifications}
                  onCheckedChange={(checked) => handleChange('customerNotifications', checked)}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-display text-xl font-bold mb-4">Payment Methods</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium">M-Pesa Payment</p>
                  <p className="text-sm text-muted-foreground">
                    Accept M-Pesa payments from customers
                  </p>
                </div>
                <Switch
                  checked={settings.mpesaEnabled}
                  onCheckedChange={(checked) => handleChange('mpesaEnabled', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium">Card Payments</p>
                  <p className="text-sm text-muted-foreground">
                    Accept credit and debit card payments
                  </p>
                </div>
                <Switch
                  checked={settings.cardPaymentEnabled}
                  onCheckedChange={(checked) => handleChange('cardPaymentEnabled', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to pay upon delivery
                  </p>
                </div>
                <Switch
                  checked={settings.cashOnDeliveryEnabled}
                  onCheckedChange={(checked) => handleChange('cashOnDeliveryEnabled', checked)}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-display text-xl font-bold mb-4">Shipping & Tax</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => handleChange('taxRate', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  VAT percentage applied to all orders
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingFee">Standard Shipping Fee (KSh)</Label>
                <Input
                  id="shippingFee"
                  type="number"
                  value={settings.shippingFee}
                  onChange={(e) => handleChange('shippingFee', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Default shipping cost for orders
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (KSh)</Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => handleChange('freeShippingThreshold', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Minimum order value for free shipping
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-display text-xl font-bold mb-4">Security</h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>
              <Button className="w-full sm:w-auto">
                <Shield className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-display text-xl font-bold mb-4">Two-Factor Authentication</h3>
            <p className="text-muted-foreground mb-4">
              Add an extra layer of security to your account
            </p>
            <Button variant="outline">
              Enable 2FA
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Changes
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
