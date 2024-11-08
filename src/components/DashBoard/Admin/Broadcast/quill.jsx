import React, { Component } from "react";
import ReactQuill, { Quill } from "react-quill";
// #1 import quill-image-uploader
import ImageUploader from "quill-image-uploader";
import 'react-quill/dist/quill.snow.css';
import { customFetch } from 'utils/customFetch';

// #2 register module

Quill.register("modules/imageUploader", ImageUploader);

class Editor extends Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
    }

    handleSubmit() {
        const editor = this.reactQuillRef.getEditor();
        this.props.handleChange(editor);
    }

    modules = {
        // #3 Add "image" to the toolbar
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" }
            ],
            ["link", "image"],
            ["clean"]
        ],
        // # 4 Add module and upload function
        imageUploader: {
            upload: (file) => {
                return new Promise((resolve, reject) => {
                    const formData = new FormData();
                    formData.append("image", file);

                    customFetch(
                        "https://api.imgbb.com/1/upload?key=7d3bd8f0aa247cf062f5cacc0a0983f8",
                        {
                            method: "POST",
                            body: formData
                        }
                    )
                        .then((response) => response.json())
                        .then((result) => {
                            (result);
                            resolve(result.data.url);
                        })
                        .catch((error) => {
                            reject("Upload failed");
                            console.error("Error:", error);
                        });
                });
            }
        }
    };

    formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "imageBlot" // #5 Optinal if using custom formats
    ];

    render() {
        return (
            <>
                <ReactQuill
                    onChange={this.props.handleChange}
                    theme="snow"
                    style={{
                        minHeight: "25vh"
                    }}
                    modules={this.modules}
                    formats={this.formats}
                    value={this.props.value}
                />
            </>
        );
    }
}

export default Editor;