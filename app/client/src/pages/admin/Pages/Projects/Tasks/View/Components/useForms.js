import { useEffect, useMemo } from "react";

const makeEmptyRow = (columns = []) => {
    const row = {};
    columns.forEach((c) => {
        row[c.slug] = "";
    });
    return row;
};

const normalizeRows = (value, columns = []) => {
    if (!Array.isArray(value) || value.length === 0) return null;

    const isObjectRow = (row) => row && typeof row === "object" && !Array.isArray(row);

    if (value.every(isObjectRow)) return value;

    if (value.every((row) => Array.isArray(row))) {
        return value.map((row) => {
            const obj = {};
            columns.forEach((col, index) => {
                obj[col.slug] = row[index] ?? "";
            });
            return obj;
        });
    }

    const colSlug = columns[0]?.slug;
    if (!colSlug) return null;

    return value.map((row) => ({ [colSlug]: row ?? "" }));
};

const normalizeRepeatableField = (field) => {
    const isRepeatable = Boolean(field?.repeatable || field?.isRepeatable);
    if (!isRepeatable || field?.type === "table") return field;

    const columnSlug = field.slug;
    const columnType = field.type || "text";
    const columns = field.columns?.length
        ? field.columns
        : [
            {
                _id: `${field._id || field.slug}-repeatable`,
                name: field.name,
                slug: columnSlug,
                type: columnType,
            },
        ];

    return {
        ...field,
        type: "table",
        columns,
        __repeatable: true,
        __orderType: field.type,
    };
};

const weightType = (type) => {
    if (type === "information") return 2;
    if (type === "table") return 3;
    if (type === "file") return 4;
    return 1;
};

export const useForms = ({ fields, taskData, formValues, setFormValues }) => {
    const normalizedFields = useMemo(
        () => (fields || []).map((field) => normalizeRepeatableField(field)),
        [fields]
    );

    const orderedFields = useMemo(() => {
        return [...normalizedFields]
            .map((field, idx) => ({ ...field, __idx: idx }))
            .sort((a, b) => {
                const wa = weightType(a.__orderType || a.type);
                const wb = weightType(b.__orderType || b.type);
                if (wa !== wb) return wa - wb;
                return a.__idx - b.__idx;
            })
            .map(({ __idx, ...rest }) => rest);
    }, [normalizedFields]);

    useEffect(() => {
        if (!normalizedFields.length) return;

        const initialValues = {};

        normalizedFields.forEach((field) => {
            const slug = field.slug;
            const taskValue = taskData?.[slug];

            if (field.type === "table") {
                const columns = field.columns || [];
                const normalizedTask = normalizeRows(taskValue, columns);
                initialValues[slug] = normalizedTask || (Array.isArray(taskValue) ? taskValue : []);
                return;
            }

            if (field.type === "file") {
                initialValues[slug] = Array.isArray(taskValue) ? taskValue : [];
                return;
            }

            initialValues[slug] = taskValue ?? "";
        });

        setFormValues(initialValues);
    }, [normalizedFields, taskData, setFormValues]);

    useEffect(() => {
        if (!normalizedFields.length) return;

        const tableFields = normalizedFields.filter((f) => f.type === "table");
        if (!tableFields.length) return;

        setFormValues((prev) => {
            const next = { ...(prev || {}) };

            tableFields.forEach((tableField) => {
                const columns = tableField.columns || [];
                const existing = normalizeRows(next[tableField.slug], columns);

                if (existing?.length) {
                    next[tableField.slug] = existing;
                    return;
                }

                next[tableField.slug] = [makeEmptyRow(columns)];
            });

            return next;
        });
    }, [normalizedFields, setFormValues]);

    const handleChange = (slug, value) => {
        setFormValues((prev) => ({
            ...(prev || {}),
            [slug]: value,
        }));
    };

    const updateTableCell = (tableSlug, rowIndex, colSlug, value) => {
        setFormValues((prev) => {
            const current = Array.isArray(prev?.[tableSlug]) ? prev[tableSlug] : [];
            const nextRows = [...current];
            nextRows[rowIndex] = { ...(nextRows[rowIndex] || {}), [colSlug]: value };
            return { ...(prev || {}), [tableSlug]: nextRows };
        });
    };

    const addTableRow = (tableSlug, columns) => {
        setFormValues((prev) => {
            const current = Array.isArray(prev?.[tableSlug]) ? prev[tableSlug] : [];
            const nextRows = [...current, makeEmptyRow(columns)];
            return { ...(prev || {}), [tableSlug]: nextRows };
        });
    };

    return {
        orderedFields,
        handleChange,
        updateTableCell,
        addTableRow,
        formValues,
    };
};
