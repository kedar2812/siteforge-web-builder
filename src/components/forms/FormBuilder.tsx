import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Move, 
  Settings, 
  Eye, 
  Code,
  Save,
  Send,
  CheckCircle,
  AlertTriangle,
  FormInput,
  Type,
  Mail,
  Phone,
  Calendar,
  FileText,
  ToggleLeft,
  List,
  Radio,
  CheckSquare
} from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file' | 'number';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  options?: string[]; // For select, radio, checkbox
  description?: string;
  order: number;
}

interface FormSettings {
  title: string;
  description?: string;
  submitText: string;
  successMessage: string;
  errorMessage: string;
  redirectUrl?: string;
  emailNotification: boolean;
  emailTo: string;
  emailSubject: string;
  emailTemplate: string;
}

interface FormBuilderProps {
  onSave?: (form: { fields: FormField[]; settings: FormSettings }) => void;
  onPreview?: (form: { fields: FormField[]; settings: FormSettings }) => void;
  onExport?: (form: { fields: FormField[]; settings: FormSettings }) => void;
  className?: string;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input', icon: Type },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'tel', label: 'Phone', icon: Phone },
  { value: 'textarea', label: 'Text Area', icon: FileText },
  { value: 'select', label: 'Dropdown', icon: List },
  { value: 'radio', label: 'Radio Buttons', icon: Radio },
  { value: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'file', label: 'File Upload', icon: FileText },
  { value: 'number', label: 'Number', icon: Type }
];

export const FormBuilder: React.FC<FormBuilderProps> = ({
  onSave,
  onPreview,
  onExport,
  className = ''
}) => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [settings, setSettings] = useState<FormSettings>({
    title: 'Contact Form',
    description: 'Please fill out the form below',
    submitText: 'Submit',
    successMessage: 'Thank you! Your message has been sent.',
    errorMessage: 'Sorry, there was an error sending your message.',
    emailNotification: true,
    emailTo: '',
    emailSubject: 'New Form Submission',
    emailTemplate: 'A new form has been submitted.'
  });
  const [activeTab, setActiveTab] = useState('fields');

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${type} field`,
      placeholder: `Enter ${type}`,
      required: false,
      order: fields.length
    };
    setFields(prev => [...prev, newField]);
    setSelectedField(newField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(prev => prev.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (id: string) => {
    setFields(prev => prev.filter(field => field.id !== id));
    if (selectedField === id) {
      setSelectedField(null);
    }
  };

  const duplicateField = (id: string) => {
    const field = fields.find(f => f.id === id);
    if (field) {
      const newField: FormField = {
        ...field,
        id: `field-${Date.now()}`,
        label: `${field.label} (Copy)`,
        order: fields.length
      };
      setFields(prev => [...prev, newField]);
    }
  };

  const moveField = (id: string, direction: 'up' | 'down') => {
    setFields(prev => {
      const index = prev.findIndex(f => f.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newFields = [...prev];
      [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
      
      return newFields.map((field, i) => ({ ...field, order: i }));
    });
  };

  const selectedFieldData = fields.find(f => f.id === selectedField);

  const renderFieldPreview = (field: FormField) => {
    const commonProps = {
      id: field.id,
      placeholder: field.placeholder,
      required: field.required,
      className: "w-full"
    };

    switch (field.type) {
      case 'textarea':
        return <Textarea {...commonProps} rows={3} />;
      case 'select':
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="radio" name={field.id} value={option} />
                <Label>{option}</Label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="checkbox" name={field.id} value={option} />
                <Label>{option}</Label>
              </div>
            ))}
          </div>
        );
      default:
        return <Input {...commonProps} type={field.type} />;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FormInput className="w-5 h-5" />
                Form Builder
              </CardTitle>
              <CardDescription>
                Create and customize forms with drag-and-drop interface
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onPreview?.({ fields, settings })}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={() => onExport?.({ fields, settings })}>
                <Code className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={() => onSave?.({ fields, settings })}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fields">Fields</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="fields" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Field Library */}
                <div className="lg:col-span-1">
                  <h3 className="font-semibold mb-3">Add Fields</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {FIELD_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Button
                          key={type.value}
                          variant="outline"
                          size="sm"
                          onClick={() => addField(type.value as FormField['type'])}
                          className="flex flex-col items-center gap-2 h-auto p-3"
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs">{type.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Field List */}
                <div className="lg:col-span-2">
                  <h3 className="font-semibold mb-3">Form Fields</h3>
                  <div className="space-y-2">
                    {fields.map((field) => (
                      <div
                        key={field.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedField === field.id ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                        onClick={() => setSelectedField(field.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {field.type}
                            </Badge>
                            <span className="font-medium">{field.label}</span>
                            {field.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateField(field.id);
                              }}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveField(field.id, 'up');
                              }}
                            >
                              <Move className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteField(field.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Field Editor */}
              {selectedFieldData && (
                <div className="mt-6">
                  <Separator />
                  <div className="mt-6">
                    <h3 className="font-semibold mb-4">Edit Field</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Field Label</Label>
                          <Input
                            value={selectedFieldData.label}
                            onChange={(e) => updateField(selectedFieldData.id, { label: e.target.value })}
                            placeholder="Enter field label"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Placeholder</Label>
                          <Input
                            value={selectedFieldData.placeholder || ''}
                            onChange={(e) => updateField(selectedFieldData.id, { placeholder: e.target.value })}
                            placeholder="Enter placeholder text"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={selectedFieldData.description || ''}
                            onChange={(e) => updateField(selectedFieldData.id, { description: e.target.value })}
                            placeholder="Enter field description"
                            rows={2}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={selectedFieldData.required}
                            onCheckedChange={(checked) => updateField(selectedFieldData.id, { required: checked })}
                          />
                          <Label>Required field</Label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {(selectedFieldData.type === 'select' || selectedFieldData.type === 'radio' || selectedFieldData.type === 'checkbox') && (
                          <div className="space-y-2">
                            <Label>Options</Label>
                            <Textarea
                              value={selectedFieldData.options?.join('\n') || ''}
                              onChange={(e) => updateField(selectedFieldData.id, { 
                                options: e.target.value.split('\n').filter(o => o.trim()) 
                              })}
                              placeholder="Enter options, one per line"
                              rows={4}
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label>Validation</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              placeholder="Min length"
                              value={selectedFieldData.validation?.minLength || ''}
                              onChange={(e) => updateField(selectedFieldData.id, {
                                validation: {
                                  ...selectedFieldData.validation,
                                  minLength: e.target.value ? parseInt(e.target.value) : undefined
                                }
                              })}
                            />
                            <Input
                              type="number"
                              placeholder="Max length"
                              value={selectedFieldData.validation?.maxLength || ''}
                              onChange={(e) => updateField(selectedFieldData.id, {
                                validation: {
                                  ...selectedFieldData.validation,
                                  maxLength: e.target.value ? parseInt(e.target.value) : undefined
                                }
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Form Title</Label>
                    <Input
                      value={settings.title}
                      onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter form title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={settings.description || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter form description"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Submit Button Text</Label>
                    <Input
                      value={settings.submitText}
                      onChange={(e) => setSettings(prev => ({ ...prev, submitText: e.target.value }))}
                      placeholder="Submit"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Success Message</Label>
                    <Textarea
                      value={settings.successMessage}
                      onChange={(e) => setSettings(prev => ({ ...prev, successMessage: e.target.value }))}
                      placeholder="Thank you! Your message has been sent."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Error Message</Label>
                    <Textarea
                      value={settings.errorMessage}
                      onChange={(e) => setSettings(prev => ({ ...prev, errorMessage: e.target.value }))}
                      placeholder="Sorry, there was an error sending your message."
                      rows={2}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Redirect URL (optional)</Label>
                    <Input
                      value={settings.redirectUrl || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, redirectUrl: e.target.value }))}
                      placeholder="https://example.com/thank-you"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.emailNotification}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotification: checked }))}
                    />
                    <Label>Email notifications</Label>
                  </div>

                  {settings.emailNotification && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Email To</Label>
                        <Input
                          value={settings.emailTo}
                          onChange={(e) => setSettings(prev => ({ ...prev, emailTo: e.target.value }))}
                          placeholder="admin@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Email Subject</Label>
                        <Input
                          value={settings.emailSubject}
                          onChange={(e) => setSettings(prev => ({ ...prev, emailSubject: e.target.value }))}
                          placeholder="New Form Submission"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Email Template</Label>
                        <Textarea
                          value={settings.emailTemplate}
                          onChange={(e) => setSettings(prev => ({ ...prev, emailTemplate: e.target.value }))}
                          placeholder="A new form has been submitted."
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="max-w-2xl mx-auto">
                <div className="border rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-2">{settings.title}</h2>
                  {settings.description && (
                    <p className="text-muted-foreground mb-6">{settings.description}</p>
                  )}
                  
                  <form className="space-y-4">
                    {fields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id}>
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {renderFieldPreview(field)}
                        {field.description && (
                          <p className="text-sm text-muted-foreground">{field.description}</p>
                        )}
                      </div>
                    ))}
                    
                    <Button type="submit" className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      {settings.submitText}
                    </Button>
                  </form>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormBuilder;
