import * as React from "react";
import * as Jumper from "~/components/core/Jumper";
import * as System from "~/components/system";
import * as FileUtilities from "~/common/file-utilities";
import * as Logging from "~/common/logging";
import * as Strings from "~/common/strings";
import * as Styles from "~/common/styles";
import * as Constants from "~/common/constants";

import { css } from "@emotion/react";
import { useUploadContext } from "~/components/core/Upload/Provider";
import { useUploadStore } from "~/components/core/Upload/store";

const STYLES_LINK_INPUT = (theme) => css`
  background-color: ${theme.semantic.bgWhite};
  width: calc(100% - 8px);
  margin-right: 8px;
`;

const STYLES_FILE_HIDDEN = css`
  height: 1px;
  width: 1px;
  opacity: 0;
  visibility: hidden;
  position: fixed;
  top: -1px;
  left: -1px;
`;

const STYLES_LINK_UPLOAD_WRAPPER = css`
  padding: 50px 72px;
`;

const STYLES_FILES_UPLOAD_WRAPPER = css`
  ${Styles.VERTICAL_CONTAINER_CENTERED};
  padding-top: 55px;
  padding-bottom: 55px;
`;

const STYLES_MOBILE_HIDDEN = css`
  @media (max-width: ${Constants.sizes.mobile}px) {
    display: none;
    pointer-events: none;
  }
`;

export function UploadJumper({ data }) {
  const [{ isUploadJumperVisible }, { hideUploadJumper }] = useUploadContext();

  const { upload, uploadLink } = useUploadStore((store) => store.handlers);

  const [state, setState] = React.useState({
    url: "",
    urlError: false,
  });

  const handleUpload = (e) => {
    const { files } = FileUtilities.formatUploadedFiles({ files: e.target.files });
    upload({ files, slate: data });
    hideUploadJumper();
  };

  const handleUploadLink = () => {
    if (Strings.isEmpty(state.url)) {
      setState((prev) => ({ ...prev, urlError: true }));
      return;
    }
    try {
      new URL(state.url);
    } catch (e) {
      Logging.error(e);
      setState((prev) => ({ ...prev, urlError: true }));
      return;
    }

    uploadLink({ url: state.url, slate: data });
    setState({ url: "", urlError: false });
    hideUploadJumper();
  };

  const handleChange = (e) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value, urlError: false }));
  };

  return (
    <Jumper.AnimatePresence>
      {isUploadJumperVisible ? (
        <Jumper.Root onClose={hideUploadJumper}>
          <Jumper.Header>
            <System.H5 color="textBlack">Upload</System.H5>
          </Jumper.Header>
          <Jumper.Divider />
          <Jumper.Item css={STYLES_LINK_UPLOAD_WRAPPER}>
            <div css={Styles.HORIZONTAL_CONTAINER}>
              <System.Input
                placeholder="Paste a link to save"
                value={state.url}
                inputCss={STYLES_LINK_INPUT}
                style={{
                  boxShadow: state.urlError
                    ? `0 0 0 1px ${Constants.system.red} inset`
                    : `${Constants.shadow.lightSmall}, 0 0 0 1px ${Constants.semantic.bgGrayLight} inset`,
                }}
                name="url"
                type="url"
                onChange={handleChange}
                onSubmit={handleUploadLink}
                autoFocus
              />
              <System.ButtonPrimary onClick={handleUploadLink}>Save</System.ButtonPrimary>
            </div>
          </Jumper.Item>
          <div css={STYLES_MOBILE_HIDDEN}>
            <Jumper.Divider />
            <Jumper.Item css={STYLES_FILES_UPLOAD_WRAPPER}>
              <input
                css={STYLES_FILE_HIDDEN}
                multiple
                type="file"
                id="file"
                onChange={handleUpload}
              />
              <System.H5 color="textGrayDark" as="p" style={{ textAlign: "center" }}>
                Drop or select files to save to Slate
                <br />
                <System.P3 color="textGrayDark" as="span">
                  (we recommend uploading fewer than 200 files at a time)
                </System.P3>
              </System.H5>
              <System.ButtonTertiary
                type="label"
                htmlFor="file"
                style={{
                  marginTop: 23,
                  maxWidth: 122,
                }}
              >
                Select files
              </System.ButtonTertiary>
            </Jumper.Item>
          </div>
        </Jumper.Root>
      ) : null}
    </Jumper.AnimatePresence>
  );
}
