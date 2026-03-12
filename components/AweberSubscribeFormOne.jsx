

const AweberSubscribeFormOne = () => {
    return (
        <div className="subscription-form-one">
            <form
                method="post"
                className="af-form-wrapper"
                acceptCharset="UTF-8"
                action="https://www.aweber.com/scripts/addlead.pl"
            >
                <div style={{ display: "none" }}>
                    <input type="hidden" name="meta_web_form_id" defaultValue={1685559735} />
                    <input type="hidden" name="meta_split_id" defaultValue="" />
                    <input type="hidden" name="listname" defaultValue="awlist6812316" />
                    <input
                        type="hidden"
                        name="redirect"
                        defaultValue="https://www.aweber.com/thankyou.htm?m=default"
                        id="redirect_9ac27c7b91360b3831b4d0916fa4a96c"
                    />
                    <input
                        type="hidden"
                        name="meta_adtracking"
                        defaultValue="ReceiptScan.org_Subscribe_Form"
                    />
                    <input type="hidden" name="meta_message" defaultValue={1} />
                    <input type="hidden" name="meta_required" defaultValue="name,email" />
                    <input type="hidden" name="meta_tooltip" defaultValue="" />
                </div>
                <div id="af-form-1685559735" className="af-form">
                    <div id="af-body-1685559735" className="af-body af-standards">
                        <div className="af-element">
                            <label className="previewLabel" htmlFor="awf_field-118589134">
                                Name:
                            </label>
                            <div className="af-textWrap">
                                <input
                                    id="awf_field-118589134"
                                    type="text"
                                    name="name"
                                    className="text"
                                    defaultValue=""
                                    onFocus={(e) => {
                                        {
                                            if (e.target.value === "") {
                                                e.target.value = "";
                                            }
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value === "") {
                                            e.target.value = "";
                                        }
                                    }}
                                    tabIndex={500}
                                />
                            </div>
                            <div className="af-clear" />
                        </div>
                        <div className="af-element">
                            <label className="previewLabel" htmlFor="awf_field-118589135">
                                Email:
                            </label>
                            <div className="af-textWrap">
                                <input
                                    className="text"
                                    id="awf_field-118589135"
                                    type="email"
                                    name="email"
                                    defaultValue=""
                                    tabIndex={501}
                                    onFocus={(e) => {
                                        {
                                            if (e.target.value === "") {
                                                e.target.value = "";
                                            }
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value === "") {
                                            e.target.value = "";
                                        }
                                    }}
                                />
                            </div>
                            <div className="af-clear" />
                        </div>
                        <div className="af-element buttonContainer">
                            <input
                                name="submit"
                                className="submit"
                                type="submit"
                                defaultValue="Submit"
                                tabIndex={502}
                            />
                            <div className="af-clear" />
                        </div>
                    </div>
                </div>
                <div style={{ display: "none" }}>
                    <img
                        src="https://forms.aweber.com/form/displays.htm?id=jGwcrKysnOzMrA=="
                        alt=""
                    />
                </div>
            </form>
        </div>
    )
}

export default AweberSubscribeFormOne;