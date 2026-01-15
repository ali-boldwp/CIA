class ShortcodeTool {
    static get toolbox() {
        return {
            title: "Shortcode",
            icon: "<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M8 7l-5 5 5 5M16 7l5 5-5 5\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>",
        };
    }

    static get sanitize() {
        return {
            value: {
                br: true,
            },
        };
    }

    constructor({ data }) {
        this.data = {
            value: data?.value || "",
        };
        this.wrapper = null;
        this.input = null;
    }

    render() {
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("shortcodeBlock");

        const label = document.createElement("label");
        label.textContent = "Shortcode";
        label.classList.add("shortcodeLabel");

        this.input = document.createElement("input");
        this.input.type = "text";
        this.input.placeholder = "e.g. [user_name] or {{date}}";
        this.input.value = this.data.value;
        this.input.classList.add("shortcodeInput");

        this.input.addEventListener("input", (event) => {
            this.data.value = event.target.value;
        });

        this.wrapper.appendChild(label);
        this.wrapper.appendChild(this.input);

        return this.wrapper;
    }

    save() {
        return {
            value: this.data.value,
        };
    }

    validate(savedData) {
        return Boolean(savedData?.value?.trim());
    }
}

export default ShortcodeTool;
