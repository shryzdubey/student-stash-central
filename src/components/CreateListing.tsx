import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, X, DollarSign, Package, Tag } from 'lucide-react';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  category: string;
  tags: string[];
  seller: string;
  createdAt: string;
}

interface CreateListingProps {
  onCreateListing: (listing: Omit<Listing, 'id' | 'createdAt'>) => void;
  userName: string;
}

const categories = [
  'Textbooks',
  'Electronics',
  'Furniture', 
  'Clothing',
  'School Supplies',
  'Sports Equipment',
  'Other'
];

const conditions = [
  { value: 'new', label: 'New', color: 'bg-marketplace-success' },
  { value: 'like-new', label: 'Like New', color: 'bg-primary' },
  { value: 'good', label: 'Good', color: 'bg-accent' },
  { value: 'fair', label: 'Fair', color: 'bg-marketplace-warning' }
];

const CreateListing: React.FC<CreateListingProps> = ({ onCreateListing, userName }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<'new' | 'like-new' | 'good' | 'fair'>('good');
  const [category, setCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your listing.",
        variant: "destructive",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Description required", 
        description: "Please enter a description for your listing.",
        variant: "destructive",
      });
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than $0.",
        variant: "destructive",
      });
      return;
    }

    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a category for your listing.",
        variant: "destructive",
      });
      return;
    }

    const newListing = {
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      condition,
      category,
      tags,
      seller: userName,
    };

    onCreateListing(newListing);

    // Reset form
    setTitle('');
    setDescription('');
    setPrice('');
    setCondition('good');
    setCategory('');
    setTags([]);
    setTagInput('');
    setIsExpanded(false);

    toast({
      title: "Listing created!",
      description: "Your item has been posted to the marketplace.",
    });
  };

  if (!isExpanded) {
    return (
      <Card className="marketplace-card border-marketplace-border cursor-pointer" onClick={() => setIsExpanded(true)}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3 glow-effect">
              <Plus className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Create New Listing</h3>
            <p className="text-sm text-muted-foreground">Sell your items to fellow students</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="marketplace-card border-marketplace-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Create New Listing
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Calculus Textbook 10th Edition"
                className="bg-input border-marketplace-border focus:ring-primary"
                maxLength={100}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="pl-10 bg-input border-marketplace-border focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your item's condition, features, and any important details..."
              className="min-h-[100px] bg-input border-marketplace-border focus:ring-primary resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/500 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-input border-marketplace-border">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Condition *</Label>
              <Select value={condition} onValueChange={(value: any) => setCondition(value)}>
                <SelectTrigger className="bg-input border-marketplace-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((cond) => (
                    <SelectItem key={cond.value} value={cond.value}>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${cond.color} mr-2`} />
                        {cond.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags (optional)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
            {tags.length < 5 && (
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add tags (e.g., barely used, urgent sale)"
                  className="bg-input border-marketplace-border focus:ring-primary"
                  maxLength={20}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  className="border-marketplace-border hover:bg-primary/10"
                >
                  Add
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Add up to 5 tags to help buyers find your item
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold glow-effect"
          >
            Create Listing
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateListing;