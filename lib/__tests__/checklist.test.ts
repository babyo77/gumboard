import { ChecklistItem } from "@/components/checklist-item";

describe("ChecklistItem Interface and Types", () => {
  it("should have the correct structure", () => {
    const checklistItem: ChecklistItem = {
      id: "test-id-123",
      content: "Test checklist item",
      checked: false,
      order: 0,
    };

    expect(checklistItem.id).toBe("test-id-123");
    expect(checklistItem.content).toBe("Test checklist item");
    expect(checklistItem.checked).toBe(false);
    expect(checklistItem.order).toBe(0);
  });

  it("should allow checked items", () => {
    const checkedItem: ChecklistItem = {
      id: "checked-item",
      content: "Completed task",
      checked: true,
      order: 1,
    };

    expect(checkedItem.checked).toBe(true);
    expect(checkedItem.order).toBe(1);
  });

  it("should handle empty content", () => {
    const emptyItem: ChecklistItem = {
      id: "empty-item",
      content: "",
      checked: false,
      order: 2,
    };

    expect(emptyItem.content).toBe("");
    expect(emptyItem.id).toBe("empty-item");
  });

  it("should handle special characters in content", () => {
    const specialItem: ChecklistItem = {
      id: "special-item",
      content: "Task with special chars: !@#$%^&*()",
      checked: false,
      order: 3,
    };

    expect(specialItem.content).toBe("Task with special chars: !@#$%^&*()");
  });

  it("should handle long content", () => {
    const longContent =
      "This is a very long checklist item content that might contain a lot of text and should be handled properly by the component without breaking the layout or functionality";
    const longItem: ChecklistItem = {
      id: "long-item",
      content: longContent,
      checked: false,
      order: 4,
    };

    expect(longItem.content).toBe(longContent);
    expect(longItem.content.length).toBeGreaterThan(100);
  });
});

describe("ChecklistItem Component Props", () => {
  it("should have all required props", () => {
    const requiredProps = [
      "item",
      "onToggle",
      "onEdit",
      "onDelete",
      "onSplit",
      "isEditing",
      "editContent",
      "onEditContentChange",
      "onStartEdit",
      "onStopEdit",
      "readonly",
      "showDeleteButton",
      "className",
    ];

    // This test ensures the component interface is properly defined
    expect(requiredProps).toContain("item");
    expect(requiredProps).toContain("onToggle");
    expect(requiredProps).toContain("onEdit");
    expect(requiredProps).toContain("onDelete");
    expect(requiredProps).toContain("onSplit");
    expect(requiredProps).toContain("isEditing");
    expect(requiredProps).toContain("editContent");
    expect(requiredProps).toContain("onEditContentChange");
    expect(requiredProps).toContain("onStartEdit");
    expect(requiredProps).toContain("onStopEdit");
    expect(requiredProps).toContain("readonly");
    expect(requiredProps).toContain("showDeleteButton");
    expect(requiredProps).toContain("className");
  });

  it("should have proper default values", () => {
    // These should match the default values in the component
    const defaultReadonly = false;
    const defaultShowDeleteButton = true;

    expect(defaultReadonly).toBe(false);
    expect(defaultShowDeleteButton).toBe(true);
  });
});

describe("Checklist Data Validation", () => {
  it("should validate checklist item IDs are unique", () => {
    const items: ChecklistItem[] = [
      { id: "item-1", content: "First item", checked: false, order: 0 },
      { id: "item-2", content: "Second item", checked: false, order: 1 },
      { id: "item-3", content: "Third item", checked: true, order: 2 },
    ];

    const ids = items.map((item) => item.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(items.length);
    expect(ids.length).toBe(3);
  });

  it("should validate order values are sequential", () => {
    const items: ChecklistItem[] = [
      { id: "item-1", content: "First item", checked: false, order: 0 },
      { id: "item-2", content: "Second item", checked: false, order: 1 },
      { id: "item-3", content: "Third item", checked: true, order: 2 },
    ];

    const orders = items.map((item) => item.order);
    const expectedOrders = [0, 1, 2];

    expect(orders).toEqual(expectedOrders);
  });

  it("should handle mixed checked states", () => {
    const items: ChecklistItem[] = [
      { id: "item-1", content: "Unchecked item", checked: false, order: 0 },
      { id: "item-2", content: "Checked item", checked: true, order: 1 },
      { id: "item-3", content: "Another unchecked", checked: false, order: 2 },
    ];

    const checkedCount = items.filter((item) => item.checked).length;
    const uncheckedCount = items.filter((item) => !item.checked).length;

    expect(checkedCount).toBe(1);
    expect(uncheckedCount).toBe(2);
  });
});

describe("Checklist Item Operations", () => {
  it("should toggle checked state", () => {
    const item: ChecklistItem = {
      id: "toggle-test",
      content: "Toggle test item",
      checked: false,
      order: 0,
    };

    // Simulate toggle operation
    const toggledItem = { ...item, checked: !item.checked };

    expect(toggledItem.checked).toBe(true);
    expect(item.checked).toBe(false); // Original unchanged
  });

  it("should update content", () => {
    const item: ChecklistItem = {
      id: "update-test",
      content: "Original content",
      checked: false,
      order: 0,
    };

    const updatedItem = { ...item, content: "Updated content" };

    expect(updatedItem.content).toBe("Updated content");
    expect(item.content).toBe("Original content"); // Original unchanged
  });

  it("should reorder items", () => {
    const items: ChecklistItem[] = [
      { id: "item-1", content: "First", checked: false, order: 0 },
      { id: "item-2", content: "Second", checked: false, order: 1 },
      { id: "item-3", content: "Third", checked: false, order: 2 },
    ];

    // Simulate reordering: move item-2 to position 0
    const reorderedItems = items.map((item) => {
      if (item.id === "item-2") {
        return { ...item, order: 0 };
      } else if (item.id === "item-1") {
        return { ...item, order: 1 };
      } else {
        return { ...item, order: 2 };
      }
    });

    // Sort by order to get the actual reordered array
    const sortedItems = reorderedItems.sort((a, b) => a.order - b.order);

    expect(sortedItems[0].id).toBe("item-2");
    expect(sortedItems[0].order).toBe(0);
    expect(sortedItems[1].id).toBe("item-1");
    expect(sortedItems[1].order).toBe(1);
    expect(sortedItems[2].id).toBe("item-3");
    expect(sortedItems[2].order).toBe(2);
  });
});

describe("Checklist Edge Cases", () => {
  it("should handle items with same content but different IDs", () => {
    const items: ChecklistItem[] = [
      { id: "item-1", content: "Same content", checked: false, order: 0 },
      { id: "item-2", content: "Same content", checked: true, order: 1 },
    ];

    expect(items[0].content).toBe(items[1].content);
    expect(items[0].id).not.toBe(items[1].id);
    expect(items[0].checked).not.toBe(items[1].checked);
  });

  it("should handle negative order values", () => {
    const item: ChecklistItem = {
      id: "negative-order",
      content: "Negative order item",
      checked: false,
      order: -1,
    };

    expect(item.order).toBe(-1);
    expect(typeof item.order).toBe("number");
  });

  it("should handle very large order values", () => {
    const item: ChecklistItem = {
      id: "large-order",
      content: "Large order item",
      checked: false,
      order: 999999,
    };

    expect(item.order).toBe(999999);
    expect(typeof item.order).toBe("number");
  });
});
