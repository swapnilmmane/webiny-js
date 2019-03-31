// @flow
import * as React from "react";
import { css } from "react-emotion";
import classnames from "classnames";

const wrapper = css({
    display: "flex",
    justifyContent: "space-between"
});

class MailchimpDefaultForm extends React.Component<
    *,
    { processing: boolean, message: React.Node }
> {
    state = {
        processing: false,
        message: null
    };

    render() {
        const { Bind, submit } = this.props;
        return (
            <div className={"mailchimp-default"}>
                <div className={classnames(wrapper)}>
                    <Bind name={"email"} validators={["required", "email"]}>
                        <input placeholder={"Your e-mail"} />
                    </Bind>
                    <button
                        disabled={this.state.processing}
                        onClick={async () => {
                            this.setState({ processing: true });

                            await submit({
                                onSuccess: () => {
                                    this.setState({ processing: false });
                                },
                                onError: err => {
                                    this.setState({ processing: false });
                                    this.setState({ message: err });
                                }
                            });

                            this.setState({ processing: false });
                        }}
                    >
                        Submit
                    </button>
                </div>
                {this.state.message && <div>{this.state.message}</div>}
            </div>
        );
    }
}

export default MailchimpDefaultForm;
