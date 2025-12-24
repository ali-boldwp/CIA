import { Editor } from "@tinymce/tinymce-react";

const TaskViewFoam = () => {
    return (
        <div className="form-box">
            <input
                type="text"
                placeholder="Task name"
                className="input"
            />

            <Editor
                apiKey="idfbzmeludrmt79pqerds1gj69t4x39q3f50auakfya63lwe"
                init={{
                    height: 220,
                    menubar: false,
                    plugins: "lists link image table code wordcount",
                    toolbar:
                        "undo redo | bold italic underline | " +
                        "fontfamily fontsize | forecolor backcolor | " +
                        "alignleft aligncenter alignright alignjustify | " +
                        "bullist numlist | link image table | code",
                }}
                placeholder="What is Lorem Ipsum?"
            />
        </div>
    );
};

export default TaskViewFoam;
