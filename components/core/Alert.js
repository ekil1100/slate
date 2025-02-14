import * as React from "react";
import * as Constants from "~/common/constants";
import * as SVG from "~/common/svg";
import * as Actions from "~/common/actions";

import { error } from "~/common/messages";
import { css } from "@emotion/react";
import { LoaderSpinner } from "~/components/system/components/Loaders";

const STYLES_ALERT = `
  box-sizing: border-box;
  z-index: ${Constants.zindex.alert};
  position: fixed;
  top: 56px;
  width: 100%;
  color: ${Constants.system.white};
  min-height: 40px;
  padding: 12px 56px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  transition: top 0.25s;

  @media (max-width: ${Constants.sizes.mobile}px) {
    width: 100%;
    padding: 12px 24px 12px 24px;
    left: 0px;
    right: 0px;
    width: 100%;
  }

  @keyframes fade-out {
    0% {
      opacity: 100%;
    }
    90% {
      opacity: 100%;
    }
    100% {
      opacity: 0%;
    }
  }
  animation: fade-out 5000ms ease-in;
`;

const STYLES_WARNING = css`
  ${STYLES_ALERT}
  background-color: ${Constants.system.red};

  @supports ((-webkit-backdrop-filter: blur(25px)) or (backdrop-filter: blur(25px))) {
    -webkit-backdrop-filter: blur(25px);
    backdrop-filter: blur(25px);
    background-color: rgba(255, 212, 201, 0.75);
    color: ${Constants.system.red};
  }
`;

const STYLES_INFO = css`
  ${STYLES_ALERT}
  background-color: ${Constants.system.blue};

  @supports ((-webkit-backdrop-filter: blur(25px)) or (backdrop-filter: blur(25px))) {
    -webkit-backdrop-filter: blur(25px);
    backdrop-filter: blur(25px);
    background-color: rgba(209, 233, 255, 0.75);
    color: ${Constants.system.blue};
  }
`;

const STYLES_MESSAGE = css`
  ${STYLES_ALERT}
  background-color: ${Constants.system.gray};
  color: ${Constants.system.grayDark2};

  @supports ((-webkit-backdrop-filter: blur(25px)) or (backdrop-filter: blur(25px))) {
    -webkit-backdrop-filter: blur(25px);
    backdrop-filter: blur(25px);
    background-color: rgba(224, 224, 224, 0.75);
  }
`;

const STYLES_TEXT = css`
  max-width: ${Constants.sizes.mobile}px;
  width: 100%;
`;

const STYLES_MESSAGE_BOX = css`
  display: flex;
  align-items: center;

  //Note(amine): remove bottom padding from svg
  svg {
    display: block;
  }
`;

export class Alert extends React.Component {
  state = {
    message: null,
    status: null,
  };

  componentDidMount = () => {
    window.addEventListener("create-alert", this._handleCreate);
  };

  componentWillUnmount = () => {
    window.removeEventListener("create-alert", this._handleCreate);
  };

  _handleCreate = (e) => {
    if (e.detail.alert) {
      if (e.detail.alert.decorator && error[e.detail.alert.decorator]) {
        this.setState({
          message: error[e.detail.alert.decorator],
          status: e.detail.alert.status || null,
        });
      } else {
        this.setState({
          message: e.detail.alert.message || "Whoops something went wrong! Please try again.",
          status: e.detail.alert.status || null,
        });
      }
      window.setTimeout(this._handleDelete, 5000);
    }
  };

  _handleDelete = (e) => {
    if (this.state.message) {
      this.setState({ message: null, status: null });
    }
  };

  _handleDismissPrivacyAlert = (e) => {
    Actions.updateStatus({ onboarding: ["hidePrivacyAlert"] });
    this.props.onAction({
      type: "UPDATE_VIEWER",
      viewer: {
        onboarding: { ...this.props.viewer.onboarding, hidePrivacyAlert: true },
      },
    });
  };

  render() {
    //NOTE(martina): alert
    if (this.state.message) {
      return (
        <div
          css={this.state.status === "INFO" ? STYLES_INFO : STYLES_WARNING}
          style={this.props.style}
        >
          {this.state.message}
        </div>
      );
    }

    //NOTE(martina): don't upload sensitive info alert
    if (this.props.viewer && !this.props.noWarning) {
      return (
        <div css={STYLES_MESSAGE} style={this.props.style}>
          <div css={STYLES_MESSAGE_BOX} style={{ fontSize: 14 }}>
            Please don't upload sensitive information to Slate yet. Private storage is coming soon.
            <span
              style={{ position: "absolute", right: 24, padding: 4, cursor: "pointer" }}
              onClick={this._handleDismissPrivacyAlert}
            >
              <SVG.Dismiss height="20px" />
            </span>
          </div>
        </div>
      );
    }

    return null;
  }
}
