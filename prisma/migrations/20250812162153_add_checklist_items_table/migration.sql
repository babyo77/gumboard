/*
  Warnings:

  - You are about to drop the column `checklistItems` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `done` on the `notes` table. All the data in the column will be lost.

*/
-- First, migrate existing checklist data from JSON to the new table structure
-- This preserves existing checklist data before dropping the old columns

-- Create the checklist_items table first
CREATE TABLE "checklist_items" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "noteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklist_items_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX "idx_checklist_note_order" ON "checklist_items"("noteId", "order");
CREATE INDEX "idx_checklist_note_checked" ON "checklist_items"("noteId", "checked");

-- Add foreign key constraint
ALTER TABLE "checklist_items" ADD CONSTRAINT "checklist_items_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing checklist data from JSON format
-- This handles the old checklistItems JSON structure and done field
INSERT INTO "checklist_items" ("id", "content", "checked", "order", "noteId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid()::text as "id",
    COALESCE(item->>'text', item->>'content', '') as "content",
    COALESCE((item->>'checked')::boolean, (item->>'done')::boolean, false) as "checked",
    COALESCE((item->>'order')::integer, 0) as "order",
    n.id as "noteId",
    n."createdAt",
    n."updatedAt"
FROM "notes" n
CROSS JOIN LATERAL jsonb_array_elements(COALESCE(n."checklistItems"::jsonb, '[]'::jsonb)) as item
WHERE n."checklistItems" IS NOT NULL 
  AND n."checklistItems" != '[]'
  AND n."checklistItems" != 'null';

-- Also migrate notes that had the old 'done' field but no checklistItems
-- These become single checklist items
INSERT INTO "checklist_items" ("id", "content", "checked", "order", "noteId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid()::text as "id",
    COALESCE(n.content, 'Task') as "content",
    COALESCE(n."done", false) as "checked",
    0 as "order",
    n.id as "noteId",
    n."createdAt",
    n."updatedAt"
FROM "notes" n
WHERE n."done" IS NOT NULL 
  AND n."done" = true
  AND (n."checklistItems" IS NULL OR n."checklistItems" = '[]' OR n."checklistItems" = 'null');

-- Now alter the notes table to drop the old columns and add archivedAt
ALTER TABLE "notes" DROP COLUMN "checklistItems",
DROP COLUMN "done",
ADD COLUMN     "archivedAt" TIMESTAMP(3);
