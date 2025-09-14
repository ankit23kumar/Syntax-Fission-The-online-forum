import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "../styles/QuillEditor.css";

const QuillEditor = ({
  value,
  onChange,
  placeholder = "Write your content here...",
}) => {
  const wrapperRef = useRef(null);
  const quillInstanceRef = useRef(null);

  useEffect(() => {
    // Check if the wrapper ref is available
    if (!wrapperRef.current) return;

    // We only want to initialize Quill once
    if (!quillInstanceRef.current) {
      const editorContainer = document.createElement("div");
      wrapperRef.current.append(editorContainer);

      const quill = new Quill(editorContainer, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "blockquote", "code-block"],
            ["clean"],
          ],
        },
      });

      quillInstanceRef.current = quill;

      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      const handleChange = () => {
        const html = quill.root.innerHTML;
        onChange(html === '<p><br></p>' ? '' : html);
      };
      quill.on("text-change", handleChange);
    }
  }, []);

  // Update effect to handle the value prop changing
  useEffect(() => {
    const quill = quillInstanceRef.current;
    if (quill && quill.root.innerHTML !== value) {
      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      } else {
        quill.setText('');
      }
    }
  }, [value]);

  return (
    <div className="quill-editor-wrapper" ref={wrapperRef} />
  );
};

export default QuillEditor;