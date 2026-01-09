import { useGetTableRowsByFieldIdQuery } from "../../../../../../../services/formFieldsApi";

const TableSidebarItem = ({ field }) => {
    const { data: tableRowsData } = useGetTableRowsByFieldIdQuery(field._id, {
        skip: field.type !== "table",
    });

    const raw = tableRowsData?.data ?? tableRowsData?.rows ?? tableRowsData;
    const rows = Array.isArray(raw) ? raw : raw ? [raw] : [];

    if (field.type !== "table") return null;
    if (!field.columns?.length) return null;

    const firstColumn = field.columns[0];

    return (
        <ul
            style={{
                marginLeft: "20px",
                paddingLeft: "8px",
                marginTop: "5px",

            }}
        >
            {rows.map((row, index) => (
                <li
                    key={row._id || index}
                    style={{
                        fontSize: "12px",
                        marginBottom: "10px",
                    }}
                >
                    {row?.data?.[firstColumn.slug] ?? "-"}
                </li>
            ))}
        </ul>
    );
};

export default TableSidebarItem;
