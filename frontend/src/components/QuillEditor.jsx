import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "../styles/QuillEditor.css";

const QuillEditor = ({ value, onChange, placeholder = "Write your content here..." }) => {
  const editorContainerRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    const container = editorContainerRef.current;

    if (!container) return;

    container.innerHTML = ""; // Clean up if re-rendering

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

    if (value) {
      quillInstance.root.innerHTML = value;
    }

    quillInstance.on("text-change", () => {
      const html = quillInstance.root.innerHTML;
      onChange(html);
    });

    quillRef.current = quillInstance;

    return () => {
      if (quillRef.current) {
        quillRef.current.off("text-change");
        quillRef.current = null;
      }

      if (editorContainerRef.current) {
        editorContainerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="quill-editor-wrapper">
      <div ref={editorContainerRef} />
    </div>
  );
};

export default QuillEditor;
