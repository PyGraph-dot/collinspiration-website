// app/admin/categories/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react'; // Added Edit and Trash2 icons
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Category {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string; // Assuming ISO string from API
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error: any) {
      toast.error(error.message || 'Error fetching categories.');
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty.');
      return;
    }
    setIsAdding(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim(), description: newCategoryDescription.trim() || null }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add category');
      }

      toast.success('Category added successfully!');
      setNewCategoryName('');
      setNewCategoryDescription('');
      fetchCategories(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || 'Error adding category.');
      console.error("Error adding category:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast.error('Category name cannot be empty.');
      return;
    }
    setIsAdding(true); // Reusing isAdding for update dialog's loading state
    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCategory.name.trim(), description: editingCategory.description?.trim() || null }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update category');
      }

      toast.success('Category updated successfully!');
      setEditingCategory(null); // Close dialog
      fetchCategories(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || 'Error updating category.');
      console.error("Error updating category:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/categories/${deleteCategoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }

      toast.success('Category deleted successfully!');
      setDeleteCategoryId(null); // Close dialog
      fetchCategories(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || 'Error deleting category.');
      console.error("Error deleting category:", error);
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Manage Categories
      </h1>

      {/* Add New Category Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Add New Category
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            disabled={isAdding}
            className="flex-1"
          />
          <Input
            placeholder="Category Description (Optional)"
            value={newCategoryDescription}
            onChange={(e) => setNewCategoryDescription(e.target.value)}
            disabled={isAdding}
            className="flex-1"
          />
          <Button onClick={handleAddCategory} disabled={isAdding}>
            {isAdding ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="mr-2 h-4 w-4" />
            )}
            Add Category
          </Button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Existing Categories
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            <p className="ml-2 text-gray-600 dark:text-gray-400">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center">No categories found. Add some above!</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description || 'N/A'}</TableCell>
                  <TableCell>{category.status}</TableCell>
                  <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right flex justify-end space-x-2">
                    {/* Edit Dialog */}
                    <Dialog onOpenChange={(open) => !open && setEditingCategory(null)} open={editingCategory?.id === category.id}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingCategory(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Category</DialogTitle>
                          <DialogDescription>
                            Make changes to the category here. Click save when you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="edit-name"
                              value={editingCategory?.name || ''}
                              onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-description" className="text-right">
                              Description
                            </Label>
                            <Input
                              id="edit-description"
                              value={editingCategory?.description || ''}
                              onChange={(e) => setEditingCategory(prev => prev ? { ...prev, description: e.target.value } : null)}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" onClick={handleUpdateCategory} disabled={isAdding}>
                            {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save changes'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Delete Dialog */}
                    <Dialog onOpenChange={(open) => !open && setDeleteCategoryId(null)} open={deleteCategoryId === category.id}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteCategoryId(category.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete the <strong>{category.name}</strong> category and remove its data from our servers.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteCategoryId(null)} disabled={isDeleting}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleDeleteCategory} disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
