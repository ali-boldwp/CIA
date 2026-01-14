import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
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

const createBlockFromType = (block, nextType) => {
    if (block.type === nextType) return block;
    const next = createBlock(nextType);
    if (block.content && ["paragraph", "heading", "quote", "code", "html"].includes(nextType)) {
        next.content = block.content;
    }
    if (block.items && nextType === "list") {
        next.items = block.items;
    }
    next.id = block.id;
    return next;
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

const BlockCard = ({
    block,
    index,
    onChange,
    onPersist,
    onTypeChange,
    onEnter,
    containerRef,
    inputRef
}) => (
    <div className={styles.blockCard} ref={containerRef}>
        <div className={styles.blockControls}>
            <select
                className={styles.typePicker}
                value={block.type}
                onChange={(event) => onTypeChange(index, event.target.value)}
            >
                {BLOCK_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                        {type.label}
                    </option>
                ))}
            </select>
        </div>

        {block.type === "paragraph" && (
            <textarea
                className={`${styles.input} ${styles.paragraph}`}
                placeholder="Write your text…"
                value={block.content}
                onChange={(event) => onChange(index, { content: event.target.value })}
                onBlur={() => onPersist(index)}
                onKeyDown={(event) => onEnter(event, index)}
                ref={inputRef}
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
                    className={`${styles.input} ${styles.heading}`}
                    type="text"
                    placeholder="Heading text"
                    value={block.content}
                    onChange={(event) => onChange(index, { content: event.target.value })}
                    onBlur={() => onPersist(index)}
                    onKeyDown={(event) => onEnter(event, index)}
                    ref={inputRef}
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
                    className={`${styles.input} ${styles.paragraph}`}
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
                    onKeyDown={(event) => onEnter(event, index)}
                    ref={inputRef}
                />
            </>
        )}

        {block.type === "quote" && (
            <div className={styles.column}>
                <textarea
                    className={`${styles.input} ${styles.paragraph}`}
                    placeholder="Quote"
                    value={block.content}
                    onChange={(event) => onChange(index, { content: event.target.value })}
                    onBlur={() => onPersist(index)}
                    onKeyDown={(event) => onEnter(event, index)}
                    ref={inputRef}
                />
                <input
                    className={`${styles.input} ${styles.paragraph}`}
                    type="text"
                    placeholder="Citation"
                    value={block.citation}
                    onChange={(event) => onChange(index, { citation: event.target.value })}
                    onBlur={() => onPersist(index)}
                    onKeyDown={(event) => onEnter(event, index)}
                />
            </div>
        )}

        {block.type === "image" && (
            <div className={styles.column}>
                <input
                    className={`${styles.input} ${styles.paragraph}`}
                    type="text"
                    placeholder="Image URL"
                    value={block.url}
                    onChange={(event) => onChange(index, { url: event.target.value })}
                    onBlur={() => onPersist(index)}
                />
                <input
                    className={`${styles.input} ${styles.paragraph}`}
                    type="text"
                    placeholder="Alt text"
                    value={block.alt}
                    onChange={(event) => onChange(index, { alt: event.target.value })}
                    onBlur={() => onPersist(index)}
                />
                <input
                    className={`${styles.input} ${styles.paragraph}`}
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
                    className={`${styles.input} ${styles.paragraph}`}
                    type="text"
                    placeholder="Button text"
                    value={block.text}
                    onChange={(event) => onChange(index, { text: event.target.value })}
                    onBlur={() => onPersist(index)}
                />
                <input
                    className={`${styles.input} ${styles.paragraph}`}
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
                    onKeyDown={(event) => onEnter(event, index)}
                    ref={inputRef}
                />
            )}

            {block.type === "html" && (
                <textarea
                    className={`${styles.input} ${styles.monospace}`}
                    placeholder="Custom HTML"
                    value={block.content}
                    onChange={(event) => onChange(index, { content: event.target.value })}
                    onBlur={() => onPersist(index)}
                    onKeyDown={(event) => onEnter(event, index)}
                    ref={inputRef}
                />
            )}
    </div>
);

const ChapterEditor = ({ chapter, categoryId }) => {
    const [updateChapterTemplate] = useUpdateChapterTemplateMutation();
    const [createChapterTemplate] = useCreateChapterTemplateMutation();
    const [blocks, setBlocks] = useState(() => htmlToBlocks(chapter.content || ""));
    const [pages, setPages] = useState([]);
    const blockRefs = useRef([]);
    const inputRefs = useRef([]);
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

    const handleAddBlock = (index = blocks.length) => {
        const nextBlock = createBlock("paragraph");
        setBlocks((prev) => {
            const next = [...prev];
            next.splice(index + 1, 0, nextBlock);
            updateContent(next, true);
            return next;
        });
    };

    const handleEnter = (event, index) => {
        if (event.key !== "Enter" || event.shiftKey) return;
        event.preventDefault();
        handleAddBlock(index);
        window.requestAnimationFrame(() => {
            inputRefs.current[index + 1]?.focus();
        });
    };

    const handleTypeChange = (index, nextType) => {
        setBlocks((prev) => {
            const next = prev.map((block, idx) =>
                idx === index ? createBlockFromType(block, nextType) : block
            );
            updateContent(next, true);
            return next;
        });
    };

    const renderBlock = (block, index, withRef = false) => (
        <BlockCard
            key={block.id}
            block={block}
            index={index}
            onChange={handleBlockChange}
            onPersist={handlePersistBlock}
            onTypeChange={handleTypeChange}
            onEnter={handleEnter}
            containerRef={(element) => {
                if (withRef) {
                    blockRefs.current[index] = element;
                }
            }}
            inputRef={(element) => {
                inputRefs.current[index] = element;
            }}
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
            </div>

            <div className={styles.editor}>
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
