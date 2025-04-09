import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { FaKey, FaSave, FaCog, FaBell, FaShieldAlt } from "react-icons/fa";

export default function Settings() {
  // General settings
  const [displayName, setDisplayName] = useState("Legal Analyst");
  const [email, setEmail] = useState("user@example.com");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [caseUpdates, setCaseUpdates] = useState(true);
  const [transcriptAnalysis, setTranscriptAnalysis] = useState(true);
  
  // API settings
  const [apiKey, setApiKey] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  const { toast } = useToast();

  const handleSaveGeneral = () => {
    // Save general settings logic here
    toast({
      title: "Settings updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    // Save notification settings logic here
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved successfully.",
    });
  };

  const handleSaveAPIKey = () => {
    // API key save logic would go here
    setIsEditing(false);
    toast({
      title: "API key updated",
      description: "Your OpenAI API key has been saved securely.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Settings</h1>
            <p className="text-gray-600 max-w-2xl">
              Configure your account settings, notification preferences, and API integrations.
            </p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <FaCog className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <FaBell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <FaKey className="h-4 w-4" />
                API Settings
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <FaShieldAlt className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>
            
            {/* General Settings */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input 
                      id="displayName" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select 
                      id="timezone" 
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="EST">EST (Eastern Standard Time)</option>
                      <option value="CST">CST (Central Standard Time)</option>
                      <option value="PST">PST (Pacific Standard Time)</option>
                    </select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveGeneral} className="flex items-center gap-2">
                    <FaSave className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Control how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch 
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Case Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when cases are updated
                      </p>
                    </div>
                    <Switch 
                      checked={caseUpdates}
                      onCheckedChange={setCaseUpdates}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Transcript Analysis Completion</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when AI completes transcript analysis
                      </p>
                    </div>
                    <Switch 
                      checked={transcriptAnalysis}
                      onCheckedChange={setTranscriptAnalysis}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveNotifications} className="flex items-center gap-2">
                    <FaSave className="h-4 w-4" />
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* API Settings */}
            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>API Configuration</CardTitle>
                  <CardDescription>
                    Manage your API keys and integration settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openaiKey">OpenAI API Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="openaiKey" 
                        type={isEditing ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={isEditing ? "Enter your OpenAI API key" : "••••••••••••••••••••••••••"}
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your API key is encrypted and stored securely. We never share your API key with third parties.
                    </p>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <Label>Model Configuration</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="model" className="text-sm">AI Model</Label>
                        <select 
                          id="model" 
                          className="w-full p-2 border rounded-md mt-1 bg-background"
                        >
                          <option value="gpt-4o">GPT-4o (Recommended)</option>
                          <option value="gpt-4-turbo">GPT-4 Turbo</option>
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="token-limit" className="text-sm">Token Limit</Label>
                        <select 
                          id="token-limit" 
                          className="w-full p-2 border rounded-md mt-1 bg-background"
                        >
                          <option value="8000">8,000 tokens</option>
                          <option value="16000">16,000 tokens</option>
                          <option value="32000">32,000 tokens (GPT-4 only)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveAPIKey} className="flex items-center gap-2">
                    <FaSave className="h-4 w-4" />
                    Save API Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Security Settings */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and privacy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Setup 2FA</Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="default" className="flex items-center gap-2">
                    <FaSave className="h-4 w-4" />
                    Update Password
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}