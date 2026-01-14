import Layout from "../../../../../layouts/Template";
import View from "./View";
import { useParams } from "react-router-dom";
import {
    useGetCategoryByIdQuery,
    useGetChapterTemplatesByCategoryQuery,
    useCreateChapterTemplateMutation,
    useUpdateChapterTemplateMutation
} from "../../../../../services/categoryApi";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { IoMdSettings } from "react-icons/io";
import "../../../../CategoryView/CategoryView.css";

const BLOCK_TYPES = [
    { value: "paragraph", label: "Paragraph" },
    { value: "heading", label: "Heading" },
    { value: "list", label: "List" },
    { value: "quote", label: "Quote" },
    { value: "image", label: "Image" },
    { value: "button", label: "Button" },
    { value: "divider", label: "Divider" },
    { value: "spacer", label: "Spacer" },
    { value: "code", label: "Code" },
    { value: "html", label: "Custom HTML" }
];

const PAGE_HEIGHT = 1123;
const PAGE_WIDTH = 794;
const PAGE_PADDING = 48;

const createBlock = (type = "paragraph") => {
    const id = `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    switch (type) {
        case "heading":
            return { id, type, content: "", level: 2 };
        case "list":
            return { id, type, items: [""], ordered: false };
        case "quote":
            return { id, type, content: "", citation: "" };
        case "image":
            return { id, type, url: "", alt: "", caption: "" };
        case "button":
            return { id, type, text: "", url: "", variant: "primary" };
        case "divider":
            return { id, type };
        case "spacer":
            return { id, type, height: 24 };
        case "code":
            return { id, type, content: "" };
        case "html":
            return { id, type, content: "" };
        case "paragraph":
        default:
            return { id, type, content: "" };
    }
};

const escapeHtml = (value) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

const htmlToBlocks = (html = "") => {
    if (!html) {
        return [createBlock("paragraph")];
    }

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const nodes = Array.from(doc.body.childNodes).filter(
            (node) => node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim()
        );

        const blocks = nodes.map((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                return { ...createBlock("paragraph"), content: node.textContent?.trim() || "" };
            }

            const tag = node.tagName?.toLowerCase();

            if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4") {
                return {
                    ...createBlock("heading"),
                    content: node.textContent || "",
                    level: Number(tag.replace("h", ""))
                };
            }

            if (tag === "p") {
                return { ...createBlock("paragraph"), content: node.textContent || "" };
            }

            if (tag === "ul" || tag === "ol") {
                const items = Array.from(node.querySelectorAll("li")).map((li) => li.textContent || "");
                return { ...createBlock("list"), items: items.length ? items : [""], ordered: tag === "ol" };
            }

            if (tag === "blockquote") {
                const citation = node.querySelector("cite")?.textContent || "";
                const content = node.cloneNode(true);
                const citeNode = content.querySelector("cite");
                if (citeNode) {
                    citeNode.remove();
                }
                return { ...createBlock("quote"), content: content.textContent?.trim() || "", citation };
            }

            if (tag === "img") {
                return {
                    ...createBlock("image"),
                    url: node.getAttribute("src") || "",
                    alt: node.getAttribute("alt") || "",
                    caption: node.getAttribute("data-caption") || ""
                };
            }

            if (tag === "hr") {
                return createBlock("divider");
            }

            if (tag === "pre" || tag === "code") {
                return { ...createBlock("code"), content: node.textContent || "" };
            }

            if (tag === "a") {
                return {
                    ...createBlock("button"),
                    text: node.textContent || "",
                    url: node.getAttribute("href") || "",
                    variant: "primary"
                };
            }

            return { ...createBlock("html"), content: node.outerHTML };
        });

        return blocks.length ? blocks : [createBlock("paragraph")];
    } catch {
        return [createBlock("html")];
    }
};

const blocksToHtml = (blocks = []) =>
    blocks
        .map((block) => {
            switch (block.type) {
                case "heading":
                    return `<h${block.level || 2}>${escapeHtml(block.content || "")}</h${block.level || 2}>`;
                case "paragraph":
                    return `<p>${escapeHtml(block.content || "")}</p>`;
                case "list": {
                    const tag = block.ordered ? "ol" : "ul";
                    const items = (block.items || [])
                        .map((item) => `<li>${escapeHtml(item || "")}</li>`)
                        .join("");
                    return `<${tag}>${items}</${tag}>`;
                }
                case "quote": {
                    const citation = block.citation ? `<cite>${escapeHtml(block.citation)}</cite>` : "";
                    return `<blockquote>${escapeHtml(block.content || "")}${citation}</blockquote>`;
                }
                case "image": {
                    const caption = block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : "";
                    return `<figure><img src="${block.url || ""}" alt="${escapeHtml(block.alt || "")}" />${caption}</figure>`;
                }
                case "button": {
                    const className = block.variant === "secondary" ? "button-secondary" : "button-primary";
                    return `<a href="${block.url || "#"}" class="${className}">${escapeHtml(block.text || "Button")}</a>`;
                }
                case "divider":
                    return "<hr />";
                case "spacer":
                    return `<div style="height:${Number(block.height) || 24}px"></div>`;
                case "code":
                    return `<pre><code>${escapeHtml(block.content || "")}</code></pre>`;
                case "html":
                    return block.content || "";
                default:
                    return "";
            }
        })
        .join("");

const TemplateChapterEditor = ({ chapter, categoryId }) => {
    const [updateChapterTemplate] = useUpdateChapterTemplateMutation();
    const [createChapterTemplate] = useCreateChapterTemplateMutation();
    const [blocks, setBlocks] = useState(() => htmlToBlocks(chapter.content || ""));
    const [addType, setAddType] = useState("paragraph");
    const [pages, setPages] = useState([]);
    const blockRefs = useRef([]);
    const [name, setName] = useState(chapter.name || "");

    useEffect(() => {
        setBlocks(htmlToBlocks(chapter.content || ""));
        setName(chapter.name || "");
    }, [chapter.uid, chapter.content, chapter.name]);

    useEffect(() => {
        const handle = window.requestAnimationFrame(() => {
            const availableHeight = PAGE_HEIGHT - PAGE_PADDING * 2;
            const nextPages = [];
            let currentPage = [];
            let currentHeight = 0;

            blocks.forEach((block, index) => {
                const height = blockRefs.current[index]?.offsetHeight || 0;

                if (currentHeight + height > availableHeight && currentPage.length) {
                    nextPages.push(currentPage);
                    currentPage = [];
                    currentHeight = 0;
                }

                currentPage.push(block);
                currentHeight += height;
            });

            if (currentPage.length) {
                nextPages.push(currentPage);
            }

            setPages(nextPages.length ? nextPages : [blocks]);
        });

        return () => window.cancelAnimationFrame(handle);
    }, [blocks]);

    const handleTitleBlur = async () => {
        if (!name.trim() || chapter.isCreated) return;

        try {
            const res = await createChapterTemplate({
                name,
                content: chapter.content || "",
                category: categoryId
            }).unwrap();

            const realId = res?.data?._id;
            toast.success("Capitol creat cu succes ");
        } catch {
            toast.error("Operația a eșuat ");
        }
    };

    const handleUpdate = async (payload) => {
        if (!chapter.isCreated) return;

        try {
            await updateChapterTemplate({
                id: chapter.uid,
                data: {
                    ...payload,
                    category: categoryId
                }
            }).unwrap();

            toast.success("Capitol actualizat cu succes");
        } catch {
            toast.error("Actualizarea a eșuat");
        }
    };

    const updateContent = (nextBlocks, persist = false) => {
        const html = blocksToHtml(nextBlocks);
        if (persist) {
            handleUpdate({ content: html });
        }
    };

    const handleBlockChange = (index, changes, persist = false) => {
        setBlocks((prev) => {
            const next = prev.map((block, idx) => (idx === index ? { ...block, ...changes } : block));
            updateContent(next, persist);
            return next;
        });
    };

    const handleMoveBlock = (index, direction) => {
        setBlocks((prev) => {
            const next = [...prev];
            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= next.length) return prev;
            const [moved] = next.splice(index, 1);
            next.splice(newIndex, 0, moved);
            updateContent(next, true);
            return next;
        });
    };

    const handleDeleteBlock = (index) => {
        setBlocks((prev) => {
            const next = prev.filter((_, idx) => idx !== index);
            const normalized = next.length ? next : [createBlock("paragraph")];
            updateContent(normalized, true);
            return normalized;
        });
    };

    const handleAddBlock = (index = blocks.length) => {
        setBlocks((prev) => {
            const next = [...prev];
            next.splice(index + 1, 0, createBlock(addType));
            updateContent(next, true);
            return next;
        });
    };

    const handleAddBlockToEnd = () => handleAddBlock(blocks.length - 1);

    const renderBlock = (block, index, { withRef } = {}) => (
        <div
            key={block.id}
            className="block"
            ref={withRef ? (element) => { blockRefs.current[index] = element; } : undefined}
        >
            <div className="block-controls">
                <span className="block-type">
                    {BLOCK_TYPES.find((type) => type.value === block.type)?.label}
                </span>
                <div className="block-controls-actions">
                    <button type="button" onClick={() => handleMoveBlock(index, -1)}>↑</button>
                    <button type="button" onClick={() => handleMoveBlock(index, 1)}>↓</button>
                    <button type="button" onClick={() => handleDeleteBlock(index)}>✕</button>
                </div>
            </div>

            {block.type === "paragraph" && (
                <textarea
                    className="block-input"
                    placeholder="Write your text…"
                    value={block.content}
                    onChange={(event) => handleBlockChange(index, { content: event.target.value })}
                    onBlur={() => handleBlockChange(index, {}, true)}
                />
            )}

            {block.type === "heading" && (
                <div className="block-field-row">
                    <select
                        className="block-select"
                        value={block.level}
                        onChange={(event) => handleBlockChange(index, { level: Number(event.target.value) })}
                        onBlur={() => handleBlockChange(index, {}, true)}
                    >
                        <option value={1}>Heading 1</option>
                        <option value={2}>Heading 2</option>
                        <option value={3}>Heading 3</option>
                        <option value={4}>Heading 4</option>
                    </select>
                    <input
                        className="block-input"
                        type="text"
                        placeholder="Heading text"
                        value={block.content}
                        onChange={(event) => handleBlockChange(index, { content: event.target.value })}
                        onBlur={() => handleBlockChange(index, {}, true)}
                    />
                </div>
            )}

            {block.type === "list" && (
                <>
                    <div className="block-field-row">
                        <select
                            className="block-select"
                            value={block.ordered ? "ordered" : "unordered"}
                            onChange={(event) =>
                                handleBlockChange(index, { ordered: event.target.value === "ordered" })
                            }
                            onBlur={() => handleBlockChange(index, {}, true)}
                        >
                            <option value="unordered">Bulleted list</option>
                            <option value="ordered">Numbered list</option>
                        </select>
                    </div>
                    <textarea
                        className="block-input"
                        placeholder="List items (one per line)"
                        value={(block.items || []).join("\n")}
                        onChange={(event) =>
                            handleBlockChange(index, {
                                items: event.target.value.split("\n").length
                                    ? event.target.value.split("\n")
                                    : [""]
                            })
                        }
                        onBlur={() => handleBlockChange(index, {}, true)}
                    />
                </>
            )}

            {block.type === "quote" && (
                <div className="block-field-column">
                    <textarea
                        className="block-input"
                        placeholder="Quote"
                        value={block.content}
                        onChange={(event) => handleBlockChange(index, { content: event.target.value })}
                        onBlur={() => handleBlockChange(index, {}, true)}
                    />
                    <input
                        className="block-input"
                        type="text"
                        placeholder="Citation"
                        value={block.citation}
                        onChange={(event) => handleBlockChange(index, { citation: event.target.value })}
                        onBlur={() => handleBlockChange(index, {}, true)}
                    />
                </div>
            )}

            {block.type === "image" && (
                <div className="block-field-column">
                    <input
                        className="block-input"
                        type="text"
                        placeholder="Image URL"
                        value={block.url}
                        onChange={(event) => handleBlockChange(index, { url: event.target.value })}
                        onBlur={() => handleBlockChange(index, {}, true)}
                    />
                    <input
                        className="block-input"
                        type="text"
                        placeholder="Alt text"
                        value={block.alt}
                        onChange={(event) => handleBlockChange(index, { alt: event.target.value })}
                        onBlur={() => handleBlockChange(index, {}, true)}
                    />
                    <input
                        className="block-input"
                        type="text"
                        placeholder="Caption"
                        value={block.caption}
                        onChange={(event) => handleBlockChange(index, { caption: event.target.value })}
                        onBlur={() => handleBlockChange(index, {}, true)}
                    />
                </div>
            )}

            {block.type === "button" && (
                <div className="block-field-column">
                    <input
                        className="block-input"
                        type="text"
                        placeholder="Button text"
                        value={block.text}
                        onChange={(event) => handleBlockChange(index, { text: event.target.value })}
                        onBlur={() => handleBlockChange(index, {}, true)}
                    />
                    <input
                        className="block-input"
                        type="text"
                        placeholder="Button URL"
                        value={block.url}
                        onChange={(event) => handleBlockChange(index, { url: event.target.value })}
                        onBlur={() => handleBlockChange(index, {}, true)}
                    />
                    <select
                        className="block-select"
                        value={block.variant}
                        onChange={(event) => handleBlockChange(index, { variant: event.target.value })}
                        onBlur={() => handleBlockChange(index, {}, true)}
                    >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                    </select>
                </div>
            )}

            {block.type === "divider" && <div className="block-divider" />}

            {block.type === "spacer" && (
                <div className="block-field-row">
                    <input
                        className="block-input"
                        type="number"
                        min="8"
                        max="120"
                        value={block.height}
                        onChange={(event) =>
                            handleBlockChange(index, { height: Number(event.target.value) })
                        }
                        onBlur={() => handleBlockChange(index, {}, true)}
                    />
                    <span className="block-hint">px spacer height</span>
                </div>
            )}

            {block.type === "code" && (
                <textarea
                    className="block-input block-monospace"
                    placeholder="Code snippet"
                    value={block.content}
                    onChange={(event) => handleBlockChange(index, { content: event.target.value })}
                    onBlur={() => handleBlockChange(index, {}, true)}
                />
            )}

            {block.type === "html" && (
                <textarea
                    className="block-input block-monospace"
                    placeholder="Custom HTML"
                    value={block.content}
                    onChange={(event) => handleBlockChange(index, { content: event.target.value })}
                    onBlur={() => handleBlockChange(index, {}, true)}
                />
            )}

            <div className="block-add-row">
                <button type="button" onClick={() => handleAddBlock(index)}>
                    + Add block below
                </button>
            </div>
        </div>
    );

    return (
        <div className="form-box">
            <div style={{ position: "relative" }}>
                <input
                    type="text"
                    placeholder="Numele capitolului"
                    className="input"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    onBlur={() =>
                        chapter.isCreated
                            ? handleUpdate({ name })
                            : handleTitleBlur()
                    }
                />

                <IoMdSettings
                    style={{
                        position: "absolute",
                        top: "10px",
                        fontSize: "13pt",
                        right: "7px",
                    }}
                />

                <div className="block-editor a4-editor">
                    <div className="block-toolbar">
                        <span className="block-toolbar-title">Blocks</span>
                        <div className="block-toolbar-actions">
                            <select
                                value={addType}
                                onChange={(event) => setAddType(event.target.value)}
                                className="block-select"
                            >
                                {BLOCK_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            <button type="button" className="block-add" onClick={handleAddBlockToEnd}>
                                + Add block
                            </button>
                        </div>
                    </div>

                    <div className="block-library">
                        <span className="block-library-title">Block Library</span>
                        <div className="block-library-grid">
                            {BLOCK_TYPES.map((type) => (
                                <button
                                    key={`library-${type.value}`}
                                    type="button"
                                    className="block-library-item"
                                    onClick={() => {
                                        setAddType(type.value);
                                        handleAddBlock(blocks.length - 1);
                                    }}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div
                        className="a4-page a4-measure"
                        style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, padding: PAGE_PADDING }}
                        aria-hidden="true"
                    >
                        {blocks.map((block, index) => renderBlock(block, index, { withRef: true }))}
                    </div>

                    <div className="a4-pages">
                        {pages.map((pageBlocks, pageIndex) => (
                            <div
                                key={`page-${pageIndex}`}
                                className="a4-page"
                                style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, padding: PAGE_PADDING }}
                            >
                                {pageBlocks.map((block) => {
                                    const index = blocks.findIndex((item) => item.id === block.id);
                                    return renderBlock(block, index);
                                })}
                                <div className="a4-page-number">Page {pageIndex + 1}</div>
                            </div>
                        ))}
                    </div>

                    <button type="button" className="block-fab" onClick={handleAddBlockToEnd}>
                        + Add new block
                    </button>
                </div>
            </div>
        </div>
    );
};

const Template = () => {

    const { id: categoryId } = useParams();

    const { data, isLoading, refetch } = useGetCategoryByIdQuery(categoryId, {
        skip: !categoryId
    });
    const { data: chapterData } = useGetChapterTemplatesByCategoryQuery(categoryId, {
        skip: !categoryId
    });

    const [chapters, setChapters] = useState([]);

    useEffect(() => {
        if (chapterData?.data) {
            setChapters(
                chapterData.data.map((chapter) => ({
                    uid: chapter._id,
                    name: chapter.name,
                    content: chapter.content || "",
                    isCreated: true
                }))
            );
        }
    }, [chapterData]);


    return (
        <Layout
            loading={ isLoading }
            content={
                <>
                    <View
                        data={data?.data}
                        categoryId={categoryId}
                        onChapterCreated={refetch}
                    />
                    <div style={{ padding: "24px" }}>
                        {chapters.map((chapter) => (
                            <TemplateChapterEditor
                                key={chapter.uid}
                                chapter={chapter}
                                categoryId={categoryId}
                            />
                        ))}
                    </div>
                </>

            }
        />
    )

}

export default Template;
