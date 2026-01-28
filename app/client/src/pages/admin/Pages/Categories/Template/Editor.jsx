import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";

import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";

import Underline from "@editorjs/underline";
import ImageTool from "@editorjs/image";
import AlignmentTuneTool from "editorjs-text-alignment-blocktune";

import { useUploadEditorImageMutation } from "../../../../../services/categoryApi";

export default function Editor({ value, onChange, readOnly = false }) {
    const editorRef = useRef(null);
    const holderRef = useRef(null);
    const isReadyRef = useRef(false);
    const saveTimeoutRef = useRef(null);

    const [uploadEditorImage] = useUploadEditorImageMutation();

    // ✅ Init editor once
    useEffect(() => {
        if (editorRef.current) return;

        const editor = new EditorJS({
            holder: holderRef.current,
            autofocus: true,
            readOnly,
            data: value || { blocks: [] },

            inlineToolbar: ["bold", "italic", "underline", "link"],

            tools: {
                paragraph: { class: Paragraph, inlineToolbar: true, tunes: ["alignmentTune"] },
                header: { class: Header, inlineToolbar: true, config: { levels: [2, 3, 4], defaultLevel: 2 }, tunes: ["alignmentTune"] },
                list: { class: List, inlineToolbar: true, tunes: ["alignmentTune"] },

                underline: Underline,

                alignmentTune: {
                    class: AlignmentTuneTool,
                    config: {
                        default: "left",
                        blocks: { header: "left", list: "left", paragraph: "left" },
                    },
                },

                image: {
                    class: ImageTool,
                    config: {
                        uploader: {
                            uploadByFile: async (file) => {
                                try {
                                    const res = await uploadEditorImage(file).unwrap();
                                    const url = res?.file?.url || res?.url;

                                    if (res?.success !== 1 || !url) {
                                        return { success: 0, message: res?.message || "Upload failed" };
                                    }

                                    return { success: 1, file: { url } };
                                } catch (e) {
                                    return { success: 0, message: "Upload failed" };
                                }
                            },

                            uploadByUrl: async (url) => {
                                return { success: 1, file: { url } };
                            },
                        },
                    },
                },
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
            editorRef.current?.destroy?.();
            editorRef.current = null;
            isReadyRef.current = false;
        };
    }, []); // ✅ init once

    // ✅ When value loads/changes (e.g. after refresh API fetch), render it
    useEffect(() => {
        const editor = editorRef.current;
        if (!editor || !isReadyRef.current) return;
        editor.render(value || { blocks: [] });
    }, [value]);

    return <div ref={holderRef} />;
}
