const AddButton = ({ onAdd }) => {
    return (
        <div className="page">
            <div className="chapter-box" onClick={onAdd}>
                <span>Add New Chapter</span>
            </div>
        </div>
    );
};

export default AddButton;
