import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";

import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";

/**
 * value: EditorJS "OutputData" object OR null
 * onChange: (outputData) => void
 * readOnly: boolean
 */
export default function Editor({ value, onChange, readOnly = false }) {
    const editorRef = useRef(null);
    const holderIdRef = useRef(`editorjs-${Math.random().toString(36).slice(2)}`);
    const isReadyRef = useRef(false);
    const saveTimeoutRef = useRef(null);

    useEffect(() => {
        if (editorRef.current) return; // prevent double init

        const editor = new EditorJS({
            holder: holderIdRef.current,
            autofocus: true,
            readOnly,
            data: value || { blocks: [] },

            tools: {
                paragraph: { class: Paragraph, inlineToolbar: true },
                header: { class: Header, inlineToolbar: true, config: { levels: [2, 3, 4], defaultLevel: 2 } },
                list: { class: List, inlineToolbar: true },
            },

            onReady: () => {
                isReadyRef.current = true;
            },

            onChange: async () => {
                // Debounce saves so you don't hammer state/api on every keystroke
                if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

                saveTimeoutRef.current = setTimeout(async () => {
                    if (!isReadyRef.current) return;

                    try {
                        const output = await editor.save();
                        onChange?.(output);
                    } catch (e) {
                        console.error("EditorJS save failed:", e);
                    }
                }, 400);
            },
        });

        editorRef.current = editor;

        return () => {
            // cleanup
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            isReadyRef.current = false;

            const instance = editorRef.current;
            editorRef.current = null;

            // destroy editor (EditorJS has destroy in newer versions; guard just in case)
            if (instance?.destroy) {
                instance.destroy();
            }
        };
    }, [onChange, readOnly, value]);

    // If you need to update editor contents when `value` changes AFTER init:
    useEffect(() => {
        const editor = editorRef.current;
        if (!editor || !isReadyRef.current) return;

        // Re-render when value changes (optional; depends on your UX)
        // If you don't want external changes to overwrite current typing, remove this.
        (async () => {
            try {
                await editor.render(value || { blocks: [] });
            } catch (e) {
                console.error("EditorJS render failed:", e);
            }
        })();
    }, [value]);

    return <div id={holderIdRef.current} />;
}
