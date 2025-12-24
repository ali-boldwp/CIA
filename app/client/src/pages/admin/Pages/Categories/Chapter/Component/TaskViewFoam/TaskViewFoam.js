import React, { useState, useRef, useMemo, useCallback } from 'react';
import JoditEditor from 'jodit-react';
const TaskViewfoam = () => {
    const editor = useRef(null);
    const [content, setContent] = useState('<p>Initial content</p>');

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: 'Start typing...',
            buttons: [
                'bold',
                'italic',
                'underline',
                '|',
                'ul',
                'ol',
                '|',
                'font',
                'fontsize',
                'brush',
                '|',
                'image',
                'link',
                '|',
                'align',
                'undo',
                'redo'
            ],
            height: 400,
            uploader: {
                insertImageAsBase64URI: true
            }
        }),
        []
    );

    const handleBlur = useCallback((newContent) => {
        setContent(newContent);
    }, []);

    const handleChange = useCallback((newContent) => {
        // You can handle onChange here if needed
    }, []);

    return (
        <div className="form-box">
            <input
                type="text"
                placeholder="Chapter name"
                className="input"
            />



            <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                onBlur={handleBlur}
                onChange={handleChange}
            />


        </div>
    );
};

export default TaskViewfoam;
