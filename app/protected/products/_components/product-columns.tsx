"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, EyeOff, MoreHorizontal, Package } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product } from "@/utils/squarespace/client";
import { EditableCell } from "./editable-cell";
import { EditableTags } from "./editable-tags";
import Image from "next/image";

export function createProductColumns(
  onUpdate: (id: string, field: string, value: unknown) => Promise<void>
): ColumnDef<Product>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "image",
      header: "Image",
      cell: ({ row }) => {
        const product = row.original;
        const image = product.images[0];
        return (
          <div className="w-12 h-12 rounded overflow-hidden bg-muted flex items-center justify-center">
            {image ? (
              <Image
                src={image.url}
                alt={image.altText || product.name}
                className="object-cover w-full h-full"
                width={250}
                height={250}
              />
            ) : (
              <Package className="h-6 w-6 text-muted-foreground/50" />
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const product = row.original;
        return (
          <EditableCell
            value={product.name}
            onSave={async (newValue) => {
              await onUpdate(product.id, "name", newValue);
            }}
            className="min-w-[200px]"
          />
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <Badge variant={type === "PHYSICAL" ? "default" : "secondary"}>
            {type}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const product = row.original;
        const mainVariant = product.variants[0];
        
        if (!mainVariant) return <span className="text-muted-foreground">N/A</span>;
        
        const price = mainVariant.pricing.onSale && mainVariant.pricing.salePrice
          ? mainVariant.pricing.salePrice
          : mainVariant.pricing.basePrice;
        
        return (
          <div className="flex flex-col gap-1">
            <EditableCell
              value={price.value}
              type="number"
              onSave={async (newValue) => {
                await onUpdate(product.id, "price", newValue);
              }}
            />
            {mainVariant.pricing.onSale && (
              <Badge variant="destructive" className="w-fit text-xs">
                On Sale
              </Badge>
            )}
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const priceA = parseFloat(rowA.original.variants[0]?.pricing.basePrice.value || "0");
        const priceB = parseFloat(rowB.original.variants[0]?.pricing.basePrice.value || "0");
        return priceA - priceB;
      },
    },
    {
      id: "visibility",
      accessorKey: "isVisible",
      header: "Visibility",
      cell: ({ row }) => {
        const product = row.original;
        const isVisible = product.isVisible;
        
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2"
            onClick={async () => {
              await onUpdate(product.id, "isVisible", !isVisible);
            }}
          >
            {isVisible ? (
              <>
                <Eye className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Visible</span>
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Hidden</span>
              </>
            )}
          </Button>
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return row.getValue(id) === (value === "visible");
      },
    },
    {
      id: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const product = row.original;
        const mainVariant = product.variants[0];
        
        if (!mainVariant?.stock) {
          return <span className="text-muted-foreground">N/A</span>;
        }
        
        if (mainVariant.stock.unlimited) {
          return <Badge variant="outline">Unlimited</Badge>;
        }
        
        return (
          <EditableCell
            value={mainVariant.stock.quantity.toString()}
            type="number"
            onSave={async (newValue) => {
              await onUpdate(product.id, "stock", parseInt(newValue));
            }}
          />
        );
      },
    },
    {
      id: "variants",
      header: "Variants",
      cell: ({ row }) => {
        const product = row.original;
        const count = product.variants.length;
        return (
          <Badge variant="secondary">
            {count} variant{count !== 1 ? "s" : ""}
          </Badge>
        );
      },
    },
    {
      id: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <EditableTags
            tags={product.tags || []}
            onSave={async (newTags) => {
              await onUpdate(product.id, "tags", newTags);
            }}
            className="min-w-[180px]"
          />
        );
      },
    },
    {
      id: "categories",
      header: "Categories",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <EditableTags
            tags={product.categories || []}
            onSave={async (newCategories) => {
              await onUpdate(product.id, "categories", newCategories);
            }}
            className="min-w-[180px]"
          />
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(product.id)}
              >
                Copy product ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href={product.url} target="_blank" rel="noopener noreferrer">
                  View in store
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
