

const AddButton = ({ setShowForm }) => {
    return (
        <div className="page">


            <div
                className="chapter-box"
                onClick={() => setShowForm(true)}
            >
                <span>Add New Task</span>
            </div>



        </div>
    );
};

export default AddButton;
