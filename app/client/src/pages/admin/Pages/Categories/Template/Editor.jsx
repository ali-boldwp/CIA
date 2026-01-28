import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";

export default function Editor({ value, onChange, readOnly = false }) {
    const editorRef = useRef(null);
    const holderRef = useRef(null);
    const isReadyRef = useRef(false);
    const saveTimeoutRef = useRef(null);

    useEffect(() => {
        if (editorRef.current) return;

        const editor = new EditorJS({
            holder: holderRef.current, // ✅ REF, not id
            autofocus: true,
            readOnly,
            data: value || { blocks: [] },
            placeholder: "Type something here...",

            tools: {
                paragraph: { class: Paragraph, inlineToolbar: true },
                header: {
                    class: Header,
                    inlineToolbar: true,
                    config: { levels: [2, 3, 4], defaultLevel: 2 },
                },
                list: { class: List, inlineToolbar: true },
            },

            onReady: () => {
                isReadyRef.current = true;
            },

            onChange: async () => {
                clearTimeout(saveTimeoutRef.current);

                saveTimeoutRef.current = setTimeout(async () => {
                    if (!isReadyRef.current) return;

                    const output = await editor.save();
                    onChange?.(output);
                }, 400);
            },
        });

        editorRef.current = editor;

        return () => {
            clearTimeout(saveTimeoutRef.current);

            if (editorRef.current?.destroy) {
                editorRef.current.destroy();
            }

            editorRef.current = null;
            isReadyRef.current = false;
        };
    }, []);

    return <div ref={holderRef} />;
}
