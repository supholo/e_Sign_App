"use client"

import { useEffect, useRef, useState } from "react"

export function useQuill() {
  const [quillInstance, setQuillInstance] = useState<any>(null)
  const quillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (quillRef.current && !quillInstance) {
      import("react-quill").then((module) => {
        const Quill = module.default
        const quill = new Quill(quillRef.current!, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"],
            ],
          },
        })
        setQuillInstance(quill)
      })
    }

    return () => {
      if (quillInstance && typeof quillInstance.destroy === "function") {
        quillInstance.destroy()
      }
    }
  }, [quillInstance])

  return { quillRef, quillInstance }
}

