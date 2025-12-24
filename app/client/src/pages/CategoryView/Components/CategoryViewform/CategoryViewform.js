import {
    RichTextEditorComponent,
    HtmlEditor,
    Toolbar,
    FormatPainter,
    QuickToolbar,
    Link,
    Image,
    Table,
    Audio,
    Video,
    Inject,
    PasteCleanup
} from "@syncfusion/ej2-react-richtexteditor";

const CategoryViewform = () => {

    const toolbarSettings = {
        items: [
            'FormatPainter',
            'Bold', 'Italic', 'Underline', 'StrikeThrough',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
            'Alignments',
            'OrderedList', 'UnorderedList',
            'CreateLink', 'Image', 'Video', 'CreateTable',
            'SourceCode', 'Undo', 'Redo'
        ]
    };

    return (
        <div className="form-box">
            <input
                type="text"
                placeholder="Chapter name"
                className="input"
            />

            <RichTextEditorComponent
                className="textarea"
                height={220}
                toolbarSettings={toolbarSettings}
                placeholder="What is Lorem Ipsum?"

            >
                <Inject
                    services={[
                        HtmlEditor,
                        Toolbar,
                        FormatPainter,
                        QuickToolbar,
                        Image,
                        Link,
                        Table,
                        Audio,
                        Video,
                        PasteCleanup
                    ]}
                />
            </RichTextEditorComponent>
        </div>
    );
};

export default CategoryViewform;
