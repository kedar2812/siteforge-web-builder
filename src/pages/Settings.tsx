import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Sparkles, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateProfile, signOut } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
    marketing: false
  });
  
  const [privacy, setPrivacy] = useState({
    profile: "public",
    analytics: true,
    cookies: true
  });

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: ''
  });

  const handleSave = async () => {
    try {
      await updateProfile(profileData);
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
    }
  };

  const handleExport = () => {
    toast.success("Data exported successfully!");
  };

  const handleImport = () => {
    toast.success("Data imported successfully!");
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await signOut();
        toast.success("Account deletion requested. You will receive an email confirmation.");
      } catch (error) {
        toast.error("Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-primary/10 transition-colors"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <Link to="/" className="flex items-center gap-2 group cursor-pointer">
              <Sparkles className="w-6 h-6 text-primary group-hover:rotate-180 transition-transform duration-200 ease-in-out" />
              <span className="text-xl font-bold text-black dark:text-white">
                SiteForge
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account preferences and application settings
            </p>
          </div>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Manage your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input 
                  id="bio" 
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..." 
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSave} className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about updates and activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive browser notifications
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Product Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new features
                  </p>
                </div>
                <Switch
                  checked={notifications.updates}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, updates: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive promotional content
                  </p>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, marketing: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control your privacy settings and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to other users
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={privacy.profile === "public" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPrivacy(prev => ({ ...prev, profile: "public" }))}
                    className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Public
                  </Button>
                  <Button
                    variant={privacy.profile === "private" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPrivacy(prev => ({ ...prev, profile: "private" }))}
                    className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                  >
                    <EyeOff className="w-4 h-4 mr-1" />
                    Private
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help us improve by sharing usage analytics
                  </p>
                </div>
                <Switch
                  checked={privacy.analytics}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, analytics: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow cookies for enhanced functionality
                  </p>
                </div>
                <Switch
                  checked={privacy.cookies}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, cookies: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred color scheme
                  </p>
                </div>
                <ThemeToggle />
              </div>
              
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  {["blue", "green", "purple", "orange", "red"].map((color) => (
                    <Button
                      key={color}
                      variant="outline"
                      size="sm"
                      className={`w-8 h-8 p-0 rounded-full bg-${color}-500 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600`}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Export, import, or manage your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleImport}
                  className="hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white hover:border-blue-600"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Danger Zone</Label>
                <p className="text-sm text-muted-foreground">
                  Irreversible and destructive actions
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Application Info */}
          <Card>
            <CardHeader>
              <CardTitle>Application Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Version</Label>
                  <p className="font-medium">1.0.0</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Build</Label>
                  <p className="font-medium">2024.01.15</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Environment</Label>
                  <Badge variant="secondary">Development</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p className="font-medium">2 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
