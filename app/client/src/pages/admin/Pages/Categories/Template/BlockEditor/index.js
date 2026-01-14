import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { IoMdSettings } from "react-icons/io";
import {
    useCreateChapterTemplateMutation,
    useUpdateChapterTemplateMutation
} from "../../../../../services/categoryApi";
import styles from "./style.module.css";

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

const BlockToolbar = ({ addType, onAddTypeChange, onAddBlock }) => (
    <div className={styles.toolbar}>
        <span className={styles.toolbarTitle}>Blocks</span>
        <div className={styles.toolbarActions}>
            <select
                value={addType}
                onChange={(event) => onAddTypeChange(event.target.value)}
                className={styles.select}
            >
                {BLOCK_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                        {type.label}
                    </option>
                ))}
            </select>
            <button type="button" className={styles.addButton} onClick={onAddBlock}>
                + Add block
            </button>
        </div>
    </div>
);

const BlockLibrary = ({ onPick }) => (
    <div className={styles.library}>
        <span className={styles.libraryTitle}>Block Library</span>
        <div className={styles.libraryGrid}>
            {BLOCK_TYPES.map((type) => (
                <button
                    key={`library-${type.value}`}
                    type="button"
                    className={styles.libraryItem}
                    onClick={() => onPick(type.value)}
                >
                    {type.label}
                </button>
            ))}
        </div>
    </div>
);

const BlockCard = ({
    block,
    index,
    onMove,
    onDelete,
    onChange,
    onPersist,
    onAddBelow,
    inputRef
}) => (
    <div className={styles.blockCard} ref={inputRef}>
        <div className={styles.blockControls}>
            <span className={styles.blockType}>
                {BLOCK_TYPES.find((type) => type.value === block.type)?.label}
            </span>
            <div className={styles.blockActions}>
                <button type="button" onClick={() => onMove(index, -1)}>↑</button>
                <button type="button" onClick={() => onMove(index, 1)}>↓</button>
                <button type="button" onClick={() => onDelete(index)}>✕</button>
            </div>
        </div>

        {block.type === "paragraph" && (
            <textarea
                className={styles.input}
                placeholder="Write your text…"
                value={block.content}
                onChange={(event) => onChange(index, { content: event.target.value })}
                onBlur={() => onPersist(index)}
            />
        )}

        {block.type === "heading" && (
            <div className={styles.row}>
                <select
                    className={styles.select}
                    value={block.level}
                    onChange={(event) => onChange(index, { level: Number(event.target.value) })}
                    onBlur={() => onPersist(index)}
                >
                    <option value={1}>Heading 1</option>
                    <option value={2}>Heading 2</option>
                    <option value={3}>Heading 3</option>
                    <option value={4}>Heading 4</option>
                </select>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Heading text"
                    value={block.content}
                    onChange={(event) => onChange(index, { content: event.target.value })}
                    onBlur={() => onPersist(index)}
                />
            </div>
        )}

        {block.type === "list" && (
            <>
                <div className={styles.row}>
                    <select
                        className={styles.select}
                        value={block.ordered ? "ordered" : "unordered"}
                        onChange={(event) =>
                            onChange(index, { ordered: event.target.value === "ordered" })
                        }
                        onBlur={() => onPersist(index)}
                    >
                        <option value="unordered">Bulleted list</option>
                        <option value="ordered">Numbered list</option>
                    </select>
                </div>
                <textarea
                    className={styles.input}
                    placeholder="List items (one per line)"
                    value={(block.items || []).join("\n")}
                    onChange={(event) =>
                        onChange(index, {
                            items: event.target.value.split("\n").length
                                ? event.target.value.split("\n")
                                : [""]
                        })
                    }
                    onBlur={() => onPersist(index)}
                />
            </>
        )}

        {block.type === "quote" && (
            <div className={styles.column}>
                <textarea
                    className={styles.input}
                    placeholder="Quote"
                    value={block.content}
                    onChange={(event) => onChange(index, { content: event.target.value })}
                    onBlur={() => onPersist(index)}
                />
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Citation"
                    value={block.citation}
                    onChange={(event) => onChange(index, { citation: event.target.value })}
                    onBlur={() => onPersist(index)}
                />
            </div>
        )}

        {block.type === "image" && (
            <div className={styles.column}>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Image URL"
                    value={block.url}
                    onChange={(event) => onChange(index, { url: event.target.value })}
                    onBlur={() => onPersist(index)}
                />
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Alt text"
                    value={block.alt}
                    onChange={(event) => onChange(index, { alt: event.target.value })}
                    onBlur={() => onPersist(index)}
                />
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Caption"
                    value={block.caption}
                    onChange={(event) => onChange(index, { caption: event.target.value })}
                    onBlur={() => onPersist(index)}
                />
            </div>
        )}

        {block.type === "button" && (
            <div className={styles.column}>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Button text"
                    value={block.text}
                    onChange={(event) => onChange(index, { text: event.target.value })}
                    onBlur={() => onPersist(index)}
                />
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Button URL"
                    value={block.url}
                    onChange={(event) => onChange(index, { url: event.target.value })}
                    onBlur={() => onPersist(index)}
                />
                <select
                    className={styles.select}
                    value={block.variant}
                    onChange={(event) => onChange(index, { variant: event.target.value })}
                    onBlur={() => onPersist(index)}
                >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                </select>
            </div>
        )}

        {block.type === "divider" && <div className={styles.divider} />}

        {block.type === "spacer" && (
            <div className={styles.row}>
                <input
                    className={styles.input}
                    type="number"
                    min="8"
                    max="120"
                    value={block.height}
                    onChange={(event) => onChange(index, { height: Number(event.target.value) })}
                    onBlur={() => onPersist(index)}
                />
                <span className={styles.hint}>px spacer height</span>
            </div>
        )}

        {block.type === "code" && (
            <textarea
                className={`${styles.input} ${styles.monospace}`}
                placeholder="Code snippet"
                value={block.content}
                onChange={(event) => onChange(index, { content: event.target.value })}
                onBlur={() => onPersist(index)}
            />
        )}

        {block.type === "html" && (
            <textarea
                className={`${styles.input} ${styles.monospace}`}
                placeholder="Custom HTML"
                value={block.content}
                onChange={(event) => onChange(index, { content: event.target.value })}
                onBlur={() => onPersist(index)}
            />
        )}

        <div className={styles.addRow}>
            <button type="button" onClick={() => onAddBelow(index)}>
                + Add block below
            </button>
        </div>
    </div>
);

const ChapterEditor = ({ chapter, categoryId }) => {
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
            await createChapterTemplate({
                name,
                content: blocksToHtml(blocks),
                category: categoryId
            }).unwrap();

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

    const handleBlockChange = (index, changes) => {
        setBlocks((prev) => {
            const next = prev.map((block, idx) => (idx === index ? { ...block, ...changes } : block));
            updateContent(next);
            return next;
        });
    };

    const handlePersistBlock = (index) => {
        updateContent(blocks, true);
        return index;
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

    const renderBlock = (block, index, withRef = false) => (
        <BlockCard
            key={block.id}
            block={block}
            index={index}
            onMove={handleMoveBlock}
            onDelete={handleDeleteBlock}
            onChange={handleBlockChange}
            onPersist={handlePersistBlock}
            onAddBelow={handleAddBlock}
            inputRef={withRef ? (element) => { blockRefs.current[index] = element; } : undefined}
        />
    );

    return (
        <div className={styles.chapterEditor}>
            <div className={styles.headerRow}>
                <input
                    type="text"
                    placeholder="Numele capitolului"
                    className={styles.chapterNameInput}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    onBlur={() =>
                        chapter.isCreated
                            ? handleUpdate({ name })
                            : handleTitleBlur()
                    }
                />
                <IoMdSettings className={styles.settingsIcon} />
            </div>

            <div className={styles.editor}>
                <BlockToolbar
                    addType={addType}
                    onAddTypeChange={setAddType}
                    onAddBlock={handleAddBlockToEnd}
                />
                <BlockLibrary
                    onPick={(type) => {
                        setAddType(type);
                        handleAddBlockToEnd();
                    }}
                />

                <div
                    className={`${styles.page} ${styles.pageMeasure}`}
                    style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, padding: PAGE_PADDING }}
                    aria-hidden="true"
                >
                    {blocks.map((block, index) => renderBlock(block, index, true))}
                </div>

                <div className={styles.pages}>
                    {pages.map((pageBlocks, pageIndex) => (
                        <div
                            key={`page-${pageIndex}`}
                            className={styles.page}
                            style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, padding: PAGE_PADDING }}
                        >
                            {pageBlocks.map((block) => {
                                const index = blocks.findIndex((item) => item.id === block.id);
                                return renderBlock(block, index);
                            })}
                            <div className={styles.pageNumber}>Page {pageIndex + 1}</div>
                        </div>
                    ))}
                </div>

                <button type="button" className={styles.fab} onClick={handleAddBlockToEnd}>
                    + Add new block
                </button>
            </div>
        </div>
    );
};

const BlockEditor = ({ chapters, categoryId }) => {
    if (!chapters.length) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            {chapters.map((chapter) => (
                <ChapterEditor key={chapter.uid} chapter={chapter} categoryId={categoryId} />
            ))}
        </div>
    );
};

export default BlockEditor;
