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

    // ✅ NEW: track last rendered + prevent render loop while typing
    const lastRenderedRef = useRef("");
    const isApplyingRemoteValueRef = useRef(false);

    const [uploadEditorImage] = useUploadEditorImageMutation();

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

            onReady: async () => {
                isReadyRef.current = true;

                // ✅ store initial rendered snapshot
                try {
                    const output = await editor.save();
                    lastRenderedRef.current = JSON.stringify(output || {});
                } catch {}
            },

            onChange: async () => {
                // ✅ if we are rendering remote value, ignore onChange triggered by render
                if (isApplyingRemoteValueRef.current) return;

                clearTimeout(saveTimeoutRef.current);
                saveTimeoutRef.current = setTimeout(async () => {
                    if (!isReadyRef.current) return;

                    const output = await editor.save();

                    // ✅ update snapshot so parent->value echo doesn't trigger render
                    lastRenderedRef.current = JSON.stringify(output || {});

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
    }, []); // init once

    // ✅ FIXED: Only render when incoming value is different from what editor already has
    useEffect(() => {
        const editor = editorRef.current;
        if (!editor || !isReadyRef.current) return;

        const incoming = value || { blocks: [] };
        const incomingStr = JSON.stringify(incoming || {});

        // if same as current editor content -> do nothing (prevents typing reset)
        if (incomingStr === lastRenderedRef.current) return;

        // apply remote value (API fetch etc.)
        isApplyingRemoteValueRef.current = true;

        editor
            .render(incoming)
            .then(() => {
                lastRenderedRef.current = incomingStr;
            })
            .finally(() => {
                // small delay to avoid immediate onChange firing after render
                setTimeout(() => {
                    isApplyingRemoteValueRef.current = false;
                }, 0);
            });
    }, [value]);

    return <div ref={holderRef} />;
}
