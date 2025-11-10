"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2, Tag, DollarSign, FolderTree } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/utils/squarespace/client";
import { useTranslations } from "next-intl";

interface BulkActionsBarProps {
  selectedProducts: Product[];
  onUpdateVisibility: (visible: boolean) => Promise<void>;
  onUpdatePrices: (adjustment: { type: "percent" | "fixed"; value: number }) => Promise<void>;
  onUpdateTags: (action: "add" | "remove", tags: string[]) => Promise<void>;
  onUpdateCategories: (action: "add" | "remove", categories: string[]) => Promise<void>;
  onDelete: () => Promise<void>;
  onClearSelection: () => void;
}

export function BulkActionsBar({
  selectedProducts,
  onUpdateVisibility,
  onUpdatePrices,
  onUpdateTags,
  onUpdateCategories,
  onDelete,
  onClearSelection,
}: BulkActionsBarProps) {
  const [showPriceDialog, setShowPriceDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showTagsDialog, setShowTagsDialog] = React.useState(false);
  const [showCategoriesDialog, setShowCategoriesDialog] = React.useState(false);
  const [priceAdjustment, setPriceAdjustment] = React.useState({ type: "percent" as const, value: 0 });
  const [tagAction, setTagAction] = React.useState<"add" | "remove">("add");
  const [tagInput, setTagInput] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [categoryAction, setCategoryAction] = React.useState<"add" | "remove">("add");
  const [categoryInput, setCategoryInput] = React.useState("");
  const [categories, setCategories] = React.useState<string[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const t = useTranslations();

  if (selectedProducts.length === 0) return null;

  const handleVisibilityUpdate = async (visible: boolean) => {
    setIsProcessing(true);
    try {
      await onUpdateVisibility(visible);
      onClearSelection();
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePriceUpdate = async () => {
    setIsProcessing(true);
    try {
      await onUpdatePrices(priceAdjustment);
      setShowPriceDialog(false);
      onClearSelection();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await onDelete();
      setShowDeleteDialog(false);
      onClearSelection();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTagsUpdate = async () => {
    if (tags.length === 0) return;
    setIsProcessing(true);
    try {
      await onUpdateTags(tagAction, tags);
      setShowTagsDialog(false);
      setTags([]);
      setTagInput("");
      onClearSelection();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCategoriesUpdate = async () => {
    if (categories.length === 0) return;
    setIsProcessing(true);
    try {
      await onUpdateCategories(categoryAction, categories);
      setShowCategoriesDialog(false);
      setCategories([]);
      setCategoryInput("");
      onClearSelection();
    } finally {
      setIsProcessing(false);
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const addCategory = () => {
    const trimmed = categoryInput.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setCategoryInput("");
    }
  };

  const removeCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category));
  };

  return (
    <>
      <div className="flex items-center justify-between bg-primary/10 px-4 py-3 rounded-lg border border-primary/20">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {selectedProducts.length} {t("products.product").toLowerCase()}{selectedProducts.length !== 1 ? "s" : ""} {selectedProducts.length !== 1 ? t("products.selectedPlural") : t("products.selected")}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            disabled={isProcessing}
          >
            {t("products.clearSelection")}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVisibilityUpdate(true)}
            disabled={isProcessing}
          >
            <Eye className="h-4 w-4" />
            {t("products.visible")}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVisibilityUpdate(false)}
            disabled={isProcessing}
          >
            <EyeOff className="h-4 w-4" />
            {t("products.hidden")}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPriceDialog(true)}
            disabled={isProcessing}
          >
            <DollarSign className="h-4 w-4" />
            {t("products.adjustPrices")}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTagsDialog(true)}
            disabled={isProcessing}
          >
            <Tag className="h-4 w-4" />
            {t("products.manageTags")}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCategoriesDialog(true)}
            disabled={isProcessing}
          >
            <FolderTree className="h-4 w-4" />
            {t("products.manageCategories")}
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isProcessing}
          >
            <Trash2 className="h-4 w-4" />
            {t("common.delete")}
          </Button>
        </div>
      </div>

      {/* Price Adjustment Dialog */}
      <Dialog open={showPriceDialog} onOpenChange={setShowPriceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Prices</DialogTitle>
            <DialogDescription>
              Update prices for {selectedProducts.length} selected product{selectedProducts.length !== 1 ? "s" : ""}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Adjustment Type</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={priceAdjustment.type}
                onChange={(e) => setPriceAdjustment({ ...priceAdjustment, type: e.target.value as "percent" })}
              >
                <option value="percent">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>
                {priceAdjustment.type === "percent" ? "Percentage Change (%)" : "Amount Change ($)"}
              </Label>
              <Input
                type="number"
                placeholder={priceAdjustment.type === "percent" ? "e.g., 10 for 10% increase" : "e.g., 5 for $5 increase"}
                value={priceAdjustment.value || ""}
                onChange={(e) => setPriceAdjustment({ ...priceAdjustment, value: parseFloat(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">
                Use negative values to decrease prices
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPriceDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handlePriceUpdate} disabled={isProcessing}>
              {isProcessing ? "Updating..." : "Update Prices"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Products</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isProcessing}>
              {isProcessing ? "Deleting..." : "Delete Products"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tags Management Dialog */}
      <Dialog open={showTagsDialog} onOpenChange={setShowTagsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
            <DialogDescription>
              {tagAction === "add" ? "Add" : "Remove"} tags for {selectedProducts.length} selected product{selectedProducts.length !== 1 ? "s" : ""}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Action</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={tagAction}
                onChange={(e) => setTagAction(e.target.value as "add" | "remove")}
              >
                <option value="add">Add Tags</option>
                <option value="remove">Remove Tags</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag} disabled={!tagInput.trim()}>
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="pr-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTagsDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleTagsUpdate} disabled={isProcessing || tags.length === 0}>
              {isProcessing ? "Updating..." : tagAction === "add" ? "Add Tags" : "Remove Tags"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Categories Management Dialog */}
      <Dialog open={showCategoriesDialog} onOpenChange={setShowCategoriesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>
              {categoryAction === "add" ? "Add" : "Remove"} categories for {selectedProducts.length} selected product{selectedProducts.length !== 1 ? "s" : ""}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Action</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={categoryAction}
                onChange={(e) => setCategoryAction(e.target.value as "add" | "remove")}
              >
                <option value="add">Add Categories</option>
                <option value="remove">Remove Categories</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter category..."
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCategory();
                    }
                  }}
                />
                <Button type="button" onClick={addCategory} disabled={!categoryInput.trim()}>
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map((category) => (
                  <Badge key={category} variant="secondary" className="pr-1">
                    {category}
                    <button
                      onClick={() => removeCategory(category)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoriesDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleCategoriesUpdate} disabled={isProcessing || categories.length === 0}>
              {isProcessing ? "Updating..." : categoryAction === "add" ? "Add Categories" : "Remove Categories"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
