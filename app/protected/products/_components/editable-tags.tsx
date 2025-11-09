"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Check, Pencil } from "lucide-react";

interface EditableTagsProps {
  tags: string[];
  onSave: (newTags: string[]) => Promise<void>;
  className?: string;
}

export function EditableTags({ tags, onSave, className = "" }: EditableTagsProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTags, setEditTags] = React.useState<string[]>(tags);
  const [newTag, setNewTag] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setEditTags(tags);
  }, [tags]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editTags);
      setIsEditing(false);
      setNewTag("");
    } catch (error) {
      console.error("Failed to save tags:", error);
      setEditTags(tags); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditTags(tags);
    setNewTag("");
    setIsEditing(false);
  };

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !editTags.includes(trimmed)) {
      setEditTags([...editTags, trimmed]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (newTag.trim()) {
        handleAddTag();
      } else {
        handleSave();
      }
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div
        className={`group flex items-center gap-1 cursor-pointer hover:bg-muted/50 px-2 py-1 rounded min-w-[150px] ${className}`}
        onClick={() => setIsEditing(true)}
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">No tags</span>
          )}
        </div>
        <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  }

  return (
    <div className="space-y-2 border rounded-md p-2 bg-background">
      <div className="flex flex-wrap gap-1">
        {editTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs pr-1">
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
              disabled={isSaving}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      
      <div className="flex gap-1">
        <Input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tag..."
          className="h-7 text-xs"
          disabled={isSaving}
        />
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={handleAddTag}
          disabled={isSaving || !newTag.trim()}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="default"
          className="h-7 text-xs"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Check className="h-3 w-3 mr-1" />
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          onClick={handleCancel}
          disabled={isSaving}
        >
          <X className="h-3 w-3 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
