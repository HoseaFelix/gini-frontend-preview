"use client";
import React from "react";

const FormatButtons = () => {
  const sizes = [12, 14, 16, 18, 20, 24, 28, 32];

  function format(command: string, value?: string | number | null) {
    document.execCommand(command, false, value != null ? String(value) : undefined);



    // If it's fontSize with pixels, overwrite the style
    if (command === "fontSize" && value) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedNode = range.startContainer.parentNode as HTMLElement;
        if (selectedNode && selectedNode.nodeType === Node.ELEMENT_NODE) {
          selectedNode.removeAttribute("size"); // remove default execCommand attr
          selectedNode.style.fontSize = value + "px"; // apply real px size
        }
      }
    }
  }



  function applyStyle(
    styleName: "textTransform" | "fontWeight" | "fontStyle",
    styleValue: string
  ) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
  
    const range = selection.getRangeAt(0);
    let parent = range.commonAncestorContainer as HTMLElement;
  
    // If selection is inside a span, climb up until we find it
    if (parent.nodeType === Node.TEXT_NODE) {
      parent = parent.parentElement as HTMLElement;
    }
  
    if (parent && parent.tagName === "SPAN") {
      // ✅ Update existing span style
      parent.style[styleName] = styleValue;
    } else {
      // ✅ Create a new span if not inside one
      const span = document.createElement("span");
      span.style[styleName] = styleValue;
      range.surroundContents(span);
    }
  }
  


  return (
    <div className="space-x-2 px-2 print:hidden sticky top-20 z-200 mx-auto">
      <button className="toolbar-buttons" onClick={() => format("undo")}>
        undo
      </button>
      <button className="toolbar-buttons" onClick={() => format("redo")}>
        redo
      </button>
      <button className="toolbar-buttons" onClick={() => format("bold")}>
        B
      </button>

      <button className="toolbar-buttons italic" onClick={() => format("italic")}>
        I
      </button>

      <button className="toolbar-buttons underline" onClick={() => format("underline")}>
        U
      </button>

      <button className="toolbar-buttons line-through" onClick={() => format("strikeThrough")}>
        S
      </button>

      <select
        onChange={(e) => format("fontSize", e.target.value)}
        className="p-2 bg-black/20 rounded-md"
      >
        {sizes.map((px, index) => (
          <option value={px} key={index}>
            {px} px
          </option>
        ))}
      </select>

      {/* Capitalize */}
      <button
        className="toolbar-buttons"
        onClick={() => applyStyle("textTransform", "capitalize")}
      >
        Aa
      </button>

      {/* Uppercase */}
      <button
        className="toolbar-buttons"
        onClick={() => applyStyle("textTransform", "uppercase")}
      >
        AA
      </button>

    </div>
  );
};

export default FormatButtons;
