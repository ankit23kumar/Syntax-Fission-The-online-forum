import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "../styles/QuillEditor.css";

const QuillEditor = ({
  value,
  onChange,
  placeholder = "Write your content here...",
}) => {
  const editorContainerRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    const container = editorContainerRef.current;
    if (!container) return;

    // 🧼 Full cleanup before initializing
    container.innerHTML = "";

    const quillInstance = new Quill(container, {
      theme: "snow",
      placeholder,
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "blockquote", "code-block"],
          ["clean"],
        ],
      },
    });

    // Set initial content if provided
    if (value) {
      quillInstance.root.innerHTML = value;
    }

    // Handle content changes
    const handleTextChange = () => {
      const html = quillInstance.root.innerHTML;
      onChange(html);
    };

    quillInstance.on("text-change", handleTextChange);

    // Store ref for cleanup
    quillRef.current = quillInstance;

    return () => {
      if (quillRef.current) {
        quillRef.current.off("text-change", handleTextChange);

        // THE FIX: Destroy Quill instance to prevent toolbar duplication
        if (typeof quillRef.current.destroy === "function") {
          quillRef.current.destroy(); //Quill 2.x cleanup
        }

        quillRef.current = null;
      }

      // Final DOM cleanup
      if (editorContainerRef.current) {
        editorContainerRef.current.innerHTML = "";
      }
    };
  }, [placeholder]);

  return (
    <div className="quill-editor-wrapper">
      <div className="quill-editor-container">
        <div ref={editorContainerRef} />
      </div>
    </div>
  );
};

export default QuillEditor;
